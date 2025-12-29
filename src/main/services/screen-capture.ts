/**
 * Screen Capture Service
 *
 * Handles the actual screen capture logic using Electron's desktopCapturer API.
 * This service provides functions to:
 * - Capture screenshots of the entire screen
 * - Get available screen sources
 * - Process and optimize captured images
 */

import { desktopCapturer, screen } from 'electron'

/**
 * Capture a screenshot of the primary display
 * @returns Base64 encoded image data (data:image/png;base64,...)
 */
export async function captureScreen(): Promise<string> {
  try {
    // Get the primary display size
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.size

    console.log(`[ScreenCapture] Display size: ${width}x${height}`)

    // Get screen sources
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: Math.floor(width * 1.5), // 1.5x for retina displays
        height: Math.floor(height * 1.5)
      }
    })

    if (sources.length === 0) {
      throw new Error('No screen sources available')
    }

    // Get the first (primary) screen
    const primarySource = sources[0]
    console.log(`[ScreenCapture] Captured from source: ${primarySource.name}`)

    // Convert thumbnail to base64 data URL
    const imageData = primarySource.thumbnail.toDataURL()

    // Log size for debugging
    const sizeInKB = Math.round(imageData.length / 1024)
    console.log(`[ScreenCapture] Image size: ${sizeInKB} KB`)

    return imageData
  } catch (error) {
    console.error('[ScreenCapture] Error capturing screen:', error)
    throw error
  }
}

/**
 * Get all available screen sources
 * @returns Array of screen sources with metadata
 */
export async function getScreenSources(): Promise<Electron.DesktopCapturerSource[]> {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 150, height: 150 } // Small thumbnails for preview
    })

    console.log(`[ScreenCapture] Found ${sources.length} screen(s)`)

    return sources.map((source) => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail,
      display_id: source.display_id,
      appIcon: source.appIcon
    }))
  } catch (error) {
    console.error('[ScreenCapture] Error getting screen sources:', error)
    throw error
  }
}

/**
 * Capture a specific screen by ID
 * @param sourceId - The ID of the screen source to capture
 * @returns Base64 encoded image data
 */
export async function captureSpecificScreen(sourceId: string): Promise<string> {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1920, height: 1080 }
    })

    const source = sources.find((s) => s.id === sourceId)

    if (!source) {
      throw new Error(`Screen source with ID ${sourceId} not found`)
    }

    return source.thumbnail.toDataURL()
  } catch (error) {
    console.error('[ScreenCapture] Error capturing specific screen:', error)
    throw error
  }
}

/**
 * Compress image data for API transmission
 * This reduces the size of the image before sending to OpenAI
 * @param imageData - Base64 image data
 * @param quality - JPEG quality (0-100)
 * @returns Compressed base64 image data
 */
export function compressImage(imageData: string, quality: number = 80): string {
  // TODO: Implement image compression
  // For now, just return the original
  // In production, you might want to use a library like 'sharp' or 'jimp'
  return imageData
}

/**
 * Check if screen capture permissions are granted (macOS)
 * @returns true if permissions are granted
 */
export async function checkScreenCapturePermissions(): Promise<boolean> {
  if (process.platform === 'darwin') {
    // On macOS, check if we have screen recording permissions
    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1, height: 1 }
      })
      return sources.length > 0
    } catch (error) {
      console.error('[ScreenCapture] Permission check failed:', error)
      return false
    }
  }

  // On Windows/Linux, assume permissions are granted
  return true
}
