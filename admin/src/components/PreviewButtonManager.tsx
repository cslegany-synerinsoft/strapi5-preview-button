import { useEffect, useRef, useState } from "react";
import { PluginSettingsResponse } from "../../../typings";
import { useFetchClient } from "@strapi/strapi/admin";
import PreviewButton from "./PreviewButton";

const PreviewButtonManager = () => {
	const { get } = useFetchClient();

	const defaultSettingsBody: PluginSettingsResponse | null = null;
	const [settings, setSettings] = useState<PluginSettingsResponse | null>(defaultSettingsBody);
	const [isLoading, setIsLoading] = useState(true);
	const isMounted = useRef(true);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);

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

	if (!settings || isLoading)
		return;

	return (
		<PreviewButton settings={settings} />
	);
}

export default PreviewButtonManager;