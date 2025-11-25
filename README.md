# Matthew Explains Video Progress Saver

A Chrome extension that automatically saves and restores video playback positions on matthewexplains.com.

## Features

- **Automatic Position Tracking**: Saves your video position while watching
- **Resume Playback**: Returns to your last position when you revisit a page
- **Per-Video Storage**: Each video page maintains its own saved position
- **Smart Updates**: Saves position every 2 seconds during playback and when paused

## Installation

**If installing from this Github Repo:**

1. **Clone or Download** this repository to your local machine

2. **Open Chrome Extensions Page**:

   - Navigate to `chrome://extensions/`
   - Or click the three dots menu → More Tools → Extensions

3. **Enable Developer Mode**:

   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**:

   - Click "Load unpacked"
   - Select the folder containing this extension (`matthew-explains-ext`)

5. **Verify Installation**:
   - You should see "Matthew Explains Video Progress Saver" in your extensions list
   - The extension is now active
   - 
**If installing from the Chrome Web Store:**

[https://chromewebstore.google.com/detail/matthew-explains-video-pr/fecblofaodiddnllpabpldijdpjoadmm](https://chromewebstore.google.com/detail/matthew-explains-video-pr/fecblofaodiddnllpabpldijdpjoadmm)

## Usage

1. Visit any matthewexplains.com page with a number in the URL (e.g., `https://matthewexplains.com/11182932/`)

2. If the page contains a video player, the extension will automatically:

   - Check for a saved position when the page loads
   - Restore the video to that position if one exists
   - Track and save your position as you watch

3. When you return to the same page later, simply click play and the video will resume from where you left off

## How It Works

- The extension uses Chrome's local storage to save video positions
- Each page's path is used as a unique key for storing its video position
- Position is saved every 2 seconds during playback, when paused, and when leaving the page
- On page load, if a saved position exists, the video automatically seeks to that point

## Privacy

- All data is stored locally in your browser
- No information is sent to external servers
- Video positions are only saved for pages you visit on matthewexplains.com

## Permissions

- **storage**: Required to save and retrieve video positions locally

## Files

- `manifest.json`: Extension configuration and metadata
- `content.js`: Content script that handles video tracking and position restoration

## Notes

- The extension only activates on pages matching the pattern `https://matthewexplains.com/[number]`
- It requires a `<video>` element to be present on the page
- Works with standard HTML5 video players
