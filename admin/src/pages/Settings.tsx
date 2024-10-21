import React, { useEffect, useRef, useState } from 'react';
import {
	Button,
	Grid,
	Flex,
	Box,
	Typography,
	Divider,
	Combobox,
	ComboboxOption,
	Field,
} from '@strapi/design-system';
import { Page, Layouts } from '@strapi/strapi/admin';
import { Check } from '@strapi/icons';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { PluginSettingsResponse } from '../../../typings';
import { useIntl } from 'react-intl';
import { getTranslation as getTrad } from '../utils/getTranslation';
import SettingsTextField from '../components/SettingsTextField';

const Settings = () => {
	const { formatMessage } = useIntl();

	const isMounted = useRef(true);
	const { get, post } = useFetchClient();

	const defaultSettingsBody: PluginSettingsResponse | null = null;
	const [settings, setSettings] = useState<PluginSettingsResponse | null>(defaultSettingsBody);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const { toggleNotification } = useNotification();

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await get<PluginSettingsResponse>(`/preview-button/settings`);
			setSettings(data);

			setIsLoading(false);
		}
		fetchData();

		// unmount
		return () => {
			isMounted.current = false;
		};
	}, []);

	const onUpdateSettings = (fieldName: string, value: string) => {
		if (!settings)
			return;

		try {
			const updatedSettings = { ...settings };
			(updatedSettings as any)[fieldName] = value;
			setSettings(updatedSettings);
		} catch (e) {
			console.log(e);
		}
	}

	const checkFormErrors = () => {
		const previewUrl = settings?.previewUrl ?? "";
		return !previewUrl;
	}

	const hasFormError = checkFormErrors();

	const onSubmit = async () => {
		if (!settings)
			return;

		setIsSaving(true);

		const res = await post(`/preview-button/settings`, {
			method: 'POST',
			body: settings
		});
		setSettings(res.data);
		setIsSaving(false);

		toggleNotification({
			type: 'success',
			message: formatMessage({
				id: 'plugin.settings.updated',
				defaultMessage: 'Settings successfully updated',
			}),
		});
	};

	if (isLoading || !settings)
		return <></>;

	return (
		<>
			<Layouts.Header
				id="title"
				title={formatMessage({ id: getTrad("plugin.settings.info.title") })}
				primaryAction={
					isLoading ? (<></>) : (
						<Button
							onClick={onSubmit}
							startIcon={<Check />}
							size="L"
							disabled={isSaving || hasFormError}
							loading={isSaving}
						>
							{formatMessage({ id: getTrad("plugin.settings.buttons.save") })}
						</Button>
					)
				}
			>
			</Layouts.Header>
			<Layouts.Content>
				{(isLoading || !settings) ? (
					<Page.Loading />
				) : (
					<>
						<Box paddingBottom={4}>
							<SettingsTextField hasTooltip={true}
								fieldName="previewUrl" displayName="fields.previewUrl" placeholder='Frontend Preview URL'
								required={true} updateItem={onUpdateSettings} value={settings?.previewUrl} />
						</Box>
						<Box paddingBottom={4}>
							<SettingsTextField hasTooltip={true}
								fieldName="previewUrlQuery" displayName="fields.previewUrlQuery" placeholder='Frontend Preview URL Query Param'
								required={false} updateItem={onUpdateSettings} value={settings?.previewUrlQuery} />
						</Box>
					</>
				)}
			</Layouts.Content >
		</>
	);
}

export default Settings;
