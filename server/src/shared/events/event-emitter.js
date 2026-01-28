import { EventEmitter } from 'events'
import logger from '../utils/logger.js'

/**
 * Internal event bus for module-to-module communication
 * Extends Node.js EventEmitter
 */
class AppEventEmitter extends EventEmitter {
    constructor() {
        super()
        this.setMaxListeners(50) // Increase limit for multiple listeners
    }

    /**
     * Emit event with logging
     * @param {String} event - Event name
     * @param {Object} data - Event data
     */
    emitEvent(event, data = {}) {
        try {
            logger.debug(`Event emitted: ${event}`, { data })
            this.emit(event, data)
        } catch (error) {
            logger.error(`Error emitting event ${event}:`, error)
        }
    }

    /**
     * Subscribe to event with error handling
     * @param {String} event - Event name
     * @param {Function} handler - Event handler
     */
    subscribe(event, handler) {
        this.on(event, async (data) => {
            try {
                await handler(data)
            } catch (error) {
                logger.error(`Error in event handler for ${event}:`, error)
            }
        })
    }

    /**
     * Subscribe to event once
     * @param {String} event - Event name
     * @param {Function} handler - Event handler
     */
    subscribeOnce(event, handler) {
        this.once(event, async (data) => {
            try {
                await handler(data)
            } catch (error) {
                logger.error(
                    `Error in one-time event handler for ${event}:`,
                    error
                )
            }
        })
    }

    /**
     * Unsubscribe from event
     * @param {String} event - Event name
     * @param {Function} handler - Event handler
     */
    unsubscribe(event, handler) {
        this.off(event, handler)
    }

    /**
     * Remove all listeners for an event
     * @param {String} event - Event name (optional)
     */
    clear(event) {
        if (event) {
            this.removeAllListeners(event)
        } else {
            this.removeAllListeners()
        }
    }

    /**
     * Get listener count for an event
     * @param {String} event - Event name
     * @returns {Number} Listener count
     */
    getListenerCount(event) {
        return this.listenerCount(event)
    }
}

// Create singleton instance
const eventBus = new AppEventEmitter()

export default eventBus
