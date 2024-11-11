import React from 'react';
import {
	Flex,
	Box,
	Grid,
	Typography,
	Card,
	CardHeader,
	CardBody,
	CardContent,
	CardBadge,
	IconButton,
} from '@strapi/design-system';

import { Trash } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { PluginSettingsBody } from '../../../typings';
import SettingsCardTextField from './SettingsCardTextField';

interface SettingsCardProps {
	setting: PluginSettingsBody,
	index: number,
	onSubmit: () => void,
	onAddCard: () => void,
	onRemoveCard: (index: number) => void,
	updateItem: (index: number, fieldName: string, value: string | number) => void,
}

const SettingsCard = (props: SettingsCardProps) => {
	const { setting, index, onRemoveCard, updateItem } = props;
	const { formatMessage } = useIntl();

	const convertFieldName = (name: string, defaultValue: string) => {
		if (!name)
			return defaultValue;

		const lastDotIdx = name.lastIndexOf("."); //convert "api::category.category" to "category"
		if (lastDotIdx === -1)
			return name;

		return name.slice(lastDotIdx + 1);
	}

	const convertFieldNames = () => {
		const from = convertFieldName(setting.entityId, "Entity Id");
		const to = convertFieldName(setting.previewUrl, "Preview Url");
		return `${from} -> ${to}`;
	}

	return (
		<Grid.Item col={6} s={12}>
			<Box padding={2}>
				<Card style={{
					width: '480px'
				}}>
					<CardHeader>
						<Box paddingBottom={2} paddingTop={2} width={'100%'}                                                >
							<Flex justifyContent="space-between">
								<Typography>
									<CardBadge>{convertFieldNames()}</CardBadge>
								</Typography>
								<Box paddingRight={1}>
									<IconButton withTooltip={false} variant="secondary" onClick={() => onRemoveCard(index)}>
										<Trash />
									</IconButton>
								</Box>
							</Flex>
						</Box>

					</CardHeader>
					<CardBody>
						<CardContent>
							<Grid.Root gap={6}>
								<Grid.Item col={6} s={12}>
									<Box paddingBottom={6}>
										<SettingsCardTextField index={index} name='entityId'
											hasTooltip={true} hasLabel={true} hasHint={false}
											required={true} updateItem={updateItem} value={setting.entityId} />
									</Box>
								</Grid.Item>
								<Grid.Item col={6} s={12}>
									<Box paddingBottom={6}>
										<SettingsCardTextField index={index} name='buttonLabel'
											hasTooltip={true} hasLabel={true} hasHint={false}
											required={true} updateItem={updateItem} value={setting.buttonLabel} />
									</Box>
								</Grid.Item>
								<Grid.Item col={12} s={12}>
									<Box paddingBottom={6} style={{ width: '100%' }}>
										<SettingsCardTextField index={index} name='previewUrl'
											hasTooltip={true} hasLabel={true} hasHint={false}
											required={true} updateItem={updateItem} value={setting.previewUrl} />
									</Box>
								</Grid.Item>
								<Grid.Item col={6} s={12}>
									<Box paddingBottom={6}>
										<SettingsCardTextField index={index} name='expiry' type='number'
											hasTooltip={true} hasLabel={true} hasHint={false}
											required={true} updateItem={updateItem} value={setting.expiry} />
									</Box>
								</Grid.Item>
							</Grid.Root>
						</CardContent>
					</CardBody>
				</Card>
			</Box>
		</Grid.Item>
	)
}

export default SettingsCard;