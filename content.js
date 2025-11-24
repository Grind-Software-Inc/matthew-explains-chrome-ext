(function () {
    'use strict';

    // Set to false for production to disable console logging
    const DEBUG = false;

    // Debug logging function
    function log(...args) {
        if (DEBUG) {
            console.log('[Video Saver]', ...args);
        }
    }

    log('Extension loaded on:', window.location.href);

    const pagePath = window.location.pathname;
    const storageKey = `video_position_${pagePath}`;

    log('Using storage key:', storageKey);

    let isInitialized = false;
    let lastSavedTime = 0;

    function savePosition(position) {
        if (position > 0) {
            chrome.storage.local.set({
                [storageKey]: {
                    position: position,
                    timestamp: Date.now()
                }
            }, function () {
                log(`Saved position: ${position.toFixed(2)} seconds`);
            });
        }
    }

    function loadPosition(callback) {
        chrome.storage.local.get([storageKey], function (result) {
            log('Storage check for key:', storageKey);
            if (result[storageKey]) {
                log('Found saved position:', result[storageKey].position);
                callback(result[storageKey].position);
            } else {
                log('No saved position found');
                callback(null);
            }
        });
    }

    function initVideoTracking(video) {
        if (isInitialized) {
            log('Already initialized, skipping');
            return;
        }

        if (!video) {
            log('No video element provided');
            return;
        }

        isInitialized = true;
        log('Initializing video tracking...');

        function restorePosition() {
            loadPosition(function (savedPosition) {
                if (savedPosition && savedPosition > 0 && video.duration) {
                    // Make sure saved position is within video duration
                    if (savedPosition < video.duration) {
                        log(`Restoring video to ${savedPosition.toFixed(2)} seconds`);
                        video.currentTime = savedPosition;
                    } else {
                        log('Saved position exceeds video duration, not restoring');
                    }
                }
            });
        }

        if (video.readyState >= 1) {
            log('Video metadata already loaded');
            restorePosition();
        } else {
            video.addEventListener('loadedmetadata', function () {
                log('Video metadata loaded');
                restorePosition();
            }, { once: true });
        }

        video.addEventListener('timeupdate', function () {
            const currentTime = video.currentTime;
            // Save every 2 seconds to avoid excessive writes
            if (Math.abs(currentTime - lastSavedTime) >= 2) {
                lastSavedTime = currentTime;
                savePosition(currentTime);
            }
        });

        video.addEventListener('pause', function () {
            log(`Video paused at ${video.currentTime.toFixed(2)} seconds`);
            savePosition(video.currentTime);
        });

        video.addEventListener('ended', function () {
            log('Video ended, clearing saved position');
            // Clear the saved position when video completes
            chrome.storage.local.remove([storageKey]);
        });

        window.addEventListener('beforeunload', function () {
            if (video.currentTime > 0 && !video.ended) {
                savePosition(video.currentTime);
            }
        });

        log('Video tracking initialized successfully');
    }

    function findAndInitVideo() {
        const video = document.querySelector('video');

        if (video) {
            log('Video element found!');
            initVideoTracking(video);
            return true;
        } else {
            log('No video element found yet');
            return false;
        }
    }

    findAndInitVideo();

    if (!isInitialized) {
        log('Setting up MutationObserver to watch for video elements');

        const observer = new MutationObserver(function (mutations) {
            if (!isInitialized && findAndInitVideo()) {
                observer.disconnect();
                log('Video found via MutationObserver, disconnecting observer');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // try after delays in case video loads slowly, there's code that won't init
        // multiple times regardless of how many times findAndInitVideo is called
        setTimeout(findAndInitVideo, 500);
        setTimeout(findAndInitVideo, 1000);
        setTimeout(findAndInitVideo, 2000);
    }
})();
