/**
 * Type shim so type-aware linting resolves without installing the full
 * pi-coding-agent package into the audit workspace. Extension code only
 * imports types from it (ExtensionAPI, ExtensionContext), which become
 * `any` here — acceptable for auditing: the rules we rely on mostly need
 * local type structure, not the host harness API surface.
 */
declare module "@earendil-works/pi-coding-agent";
