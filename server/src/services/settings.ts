import type { Core } from '@strapi/strapi';
import { PluginSettingsResponse } from '../../../typings';

const getPluginStore = () => {
    return strapi.store({
        environment: '',
        type: 'plugin',
        name: 'preview-button',
    });
};

const createDefaultConfig = async () => {
    const pluginStore = getPluginStore();

    const value: PluginSettingsResponse = {
        previewUrl: "",
        previewUrlQuery: "elonezet",
    };
    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({

    async getSettings() {
        const pluginStore = getPluginStore();
        let config = await pluginStore.get({ key: 'settings' });
        if (!config) {
            config = await createDefaultConfig();
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