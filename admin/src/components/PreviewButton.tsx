import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useParams } from "react-router-dom"; //In react-router-dom v6 useHistory() is replaced by useNavigate().
import { unstable_useContentManagerContext as useContentManagerContext, useFetchClient, useNotification } from '@strapi/strapi/admin';
import {
	Button,
	Box,
	Modal,
	Typography,
	Flex
} from "@strapi/design-system";
import { Duplicate, PresentationChart } from "@strapi/icons";

import moment from "moment";
import * as CryptoJS from 'crypto-js';
import { getTranslation as getTrad } from '../utils/getTranslation';
import { PluginSettingsBody, PluginSettingsResponse } from "../../../typings";

interface PreviewButtonProps {
	settings: PluginSettingsResponse;
}

const PreviewButton = ({ settings }: PreviewButtonProps) => {
	const { formatMessage } = useIntl();
	const { toggleNotification } = useNotification();
	const { pathname } = useLocation();

	const pathnameLower = pathname.toLowerCase();

	const { isSingleType, isCreatingEntry } = useContentManagerContext();
	if (isSingleType || isCreatingEntry || pathnameLower.endsWith("/create")) //isCreatingEntry can be false even though we're creating an entry
		return null;

	let settingForEntity = settings.items.find(x => pathnameLower.includes(x.entityId));
	if (!settingForEntity)
		return null;

	const { id } = useParams<{ id: string }>();

	const [pinCode, setPinCode] = useState<number | null>(null);

	const onCopyPINToClipboard = (e: any) => {
		if (!pinCode)
			return;

		navigator.clipboard.writeText(pinCode.toString()).then(() => {
			toggleNotification({
				type: 'success',
				message: formatMessage({
					id: 'plugin.modal.pinCode.copied',
					defaultMessage: 'PIN code has been copied to Clipboard',
				}),
			});
		});
	}

	const handlePreview = () => {
		try {

			//generate token
			const docId = id;
			const expDate = moment().add(5, "minutes").toISOString();

			const hash = "da39a3ee5e6b4b0d3255bfef95601890afd80709";
			const pinCode = Math.floor(Math.random() * (99999 - 11111 + 1)) + 11111;

			const secret = `${hash}_${pinCode}`;
			const jsonString = JSON.stringify({ docId, expDate });

			const token = CryptoJS.AES.encrypt(jsonString, secret).toString();
			setPinCode(pinCode);

			const queryParams = new URLSearchParams({ token });
			const queryString = queryParams.toString();

			//open link in new browser tab
			window.open(`${settingForEntity?.previewUrl}?${queryString}`, '_blank');
		}
		catch (error) {
			console.error(error);
			alert("An unexpected error occurred!");
		}
	};

	return (
		<>
			{id && (
				<Modal.Root>
					<Modal.Trigger>
						<Box style={{ width: '100%' }}>
							<Button style={{ width: '100%' }} variant="secondary" startIcon={<PresentationChart />}
								onClick={handlePreview}>
								{settingForEntity.buttonLabel}
							</Button>
						</Box>
					</Modal.Trigger>
					<Modal.Content style={{ width: '400px' }}>
						<Modal.Header>
							<Modal.Title>
								{formatMessage({ id: getTrad("plugin.modal.title") })}
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Typography variant="omega">
								{formatMessage({ id: getTrad("plugin.modal.info") })}
							</Typography>
							<Box paddingTop={4}>
								<Flex justifyContent="space-between">
									<Typography variant="beta" id="pinCode">
										{pinCode}
									</Typography>
									<Button variant="default" startIcon={<Duplicate />} onClick={onCopyPINToClipboard}>
										{formatMessage({ id: getTrad("plugin.buttons.copy") })}
									</Button>
								</Flex>
							</Box>
						</Modal.Body>
						<Modal.Footer>
							<Modal.Close>
								<Button variant="tertiary">
									{formatMessage({ id: getTrad("plugin.buttons.close") })}
								</Button>
							</Modal.Close>
						</Modal.Footer>
					</Modal.Content>
				</Modal.Root>
			)}
		</>
	);
}

export default PreviewButton;