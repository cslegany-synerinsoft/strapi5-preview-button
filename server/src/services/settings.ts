import type { Core } from '@strapi/strapi';
import { PluginSettingsBody, PluginSettingsResponse } from '../../../typings';

const getPluginStore = () => {
    return strapi.store({
        environment: '',
        type: 'plugin',
        name: 'preview-button',
    });
};

const createDefaultConfig = async () => {
    const pluginStore = getPluginStore();

    const settingsList: Array<PluginSettingsBody> = [
        {
            entityId: 'api::article.article',
            previewUrl: 'http://localhost:3000/elonezet',
            buttonLabel: 'Preview'
        }
    ];
    const value: PluginSettingsResponse = {
        items: settingsList
    };
    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({

    async getSettings() {
        const pluginStore = getPluginStore();
        let config = await pluginStore.get({ key: 'settings' }) as PluginSettingsResponse;
        if (!config || !config.items) {
            config = (await createDefaultConfig()) as PluginSettingsResponse;
        }
        return config;
    },

    async setSettings(settings) {
        const value = settings;
        const pluginStore = getPluginStore();

        await pluginStore.set({ key: 'settings', value });
        return pluginStore.get({ key: 'settings' });
    },

});