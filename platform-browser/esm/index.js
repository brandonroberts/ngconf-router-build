export { DomEventsPlugin } from './src/dom/events/dom_events';
export { KeyEventsPlugin } from './src/dom/events/key_events';
export { EventManager, EVENT_MANAGER_PLUGINS } from './src/dom/events/event_manager';
export { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from './src/dom/events/hammer_gestures';
export { ELEMENT_PROBE_PROVIDERS } from './src/dom/debug/ng_probe';
export { By } from './src/dom/debug/by';
export { DOCUMENT } from './src/dom/dom_tokens';
export { BrowserPlatformLocation } from './src/browser/location/browser_platform_location';
export { Title } from './src/browser/title';
export { enableDebugTools, disableDebugTools } from './src/browser/tools/tools';
export { DomSanitizationService, SecurityContext } from './src/security/dom_sanitization_service';
export * from './src/browser';
// Web Workers
export { ClientMessageBroker, ClientMessageBrokerFactory, FnArg, UiArguments } from './src/web_workers/shared/client_message_broker';
export { ReceivedMessage, ServiceMessageBroker, ServiceMessageBrokerFactory } from './src/web_workers/shared/service_message_broker';
export { PRIMITIVE } from './src/web_workers/shared/serializer';
export * from './src/web_workers/shared/message_bus';
export { WORKER_APP_LOCATION_PROVIDERS } from './src/web_workers/worker/location_providers';
export { WORKER_RENDER_LOCATION_PROVIDERS } from './src/web_workers/ui/location_providers';
export * from './src/worker_render';
export * from './src/worker_app';
export * from './private_export';
import { BROWSER_PLATFORM_PROVIDERS } from './src/browser';
/* @deprecated use BROWSER_PLATFORM_PROVIDERS */
export const BROWSER_PROVIDERS = BROWSER_PLATFORM_PROVIDERS;
//# sourceMappingURL=index.js.map