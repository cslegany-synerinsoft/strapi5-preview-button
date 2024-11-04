export interface PluginSettingsBody {
    entityId: string;
    previewUrl: string;
    buttonLabel: string;
}

export interface PluginSettingsResponse {
    items: Array<PluginSettingsBody>;
}