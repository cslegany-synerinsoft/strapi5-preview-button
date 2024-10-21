import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useParams } from "react-router-dom"; //In react-router-dom v6 useHistory() is replaced by useNavigate().
import { unstable_useContentManagerContext as useContentManagerContext, useFetchClient } from '@strapi/strapi/admin';
import { Button, Box } from "@strapi/design-system";
import { PresentationChart } from "@strapi/icons";

import moment from "moment";
import * as CryptoJS from 'crypto-js';
import { PluginSettingsResponse } from "../../../typings";

const PreviewButton = () => {
	const { formatMessage } = useIntl();
	const { pathname } = useLocation();

	const { isSingleType, isCreatingEntry } = useContentManagerContext();
	if (isSingleType || isCreatingEntry || pathname.toLowerCase().endsWith("/create")) //isCreatingEntry can be false even though we're creating an entry
		return null;

	const { id } = useParams<{ id: string }>();

	const isMounted = useRef(true);
	const { get } = useFetchClient();
	const [isLoading, setIsLoading] = useState(true);
	const defaultSettingsBody: PluginSettingsResponse | null = null;
	const [settings, setSettings] = useState<PluginSettingsResponse | null>(defaultSettingsBody);

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

	const handlePreview = () => {
		try {
			//app base url
			let appBaseUrl = settings?.previewUrl;
			if (!appBaseUrl) {
				alert(`Invalid previewUrl: ${appBaseUrl}`);
				return;
			}

			if (appBaseUrl.substring(appBaseUrl.length - 1) === "/")
				appBaseUrl = appBaseUrl.slice(0, -1);

			//generate token
			const docId = id;
			const expDate = moment().add(5, "minutes").toISOString();

			const hash = "da39a3ee5e6b4b0d3255bfef95601890afd80709";
			const pinCode = Math.floor(Math.random() * (99999 - 11111 + 1)) + 11111;

			const secret = `${hash}_${pinCode}`;
			const jsonString = JSON.stringify({ docId, expDate });

			const token = CryptoJS.AES.encrypt(jsonString, secret).toString();

			const pinCodeMessage = formatMessage({
				id: "plugin.buttons.pinCodeMessage",
				defaultMessage: "PIN code",
			});
			alert(`${pinCodeMessage}: ${pinCode}`);

			let appBaseUrlJoined = `${appBaseUrl}`;
			if(settings?.previewUrlQuery)
				appBaseUrlJoined = `${appBaseUrl}/${settings?.previewUrlQuery}`;

			//open link in new browser tab
			window.open(`${appBaseUrlJoined}?token=${encodeURIComponent(token)}`, '_blank'); //.focus();

		}
		catch (error) {
			console.error(error);
			alert("An unexpected error occurred!");
		}

	};

	return (
		<>
			{id && (
				<Box style={{ width: '100%' }}>
					<Button style={{ width: '100%' }} variant="secondary" startIcon={<PresentationChart />} onClick={handlePreview}>
						{formatMessage({
							id: "plugin.buttons.preview",
							defaultMessage: "Preview",
						})}
					</Button>
				</Box>
			)}
		</>
	);
}

export default PreviewButton;