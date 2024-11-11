export interface PluginSettingsBody {
    entityId: string;
    previewUrl: string;
    buttonLabel: string;
    expiry: 300,
}

export interface PluginSettingsResponse {
    items: Array<PluginSettingsBody>;
}