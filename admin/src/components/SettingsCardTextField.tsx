import React, { useState } from 'react';
import {
	Flex,
	Field,
	TextInput,
	Box,
} from '@strapi/design-system';
import { useIntl } from "react-intl";
import { getTranslation as getTrad } from '../utils/getTranslation';
import { Information } from '@strapi/icons';
import TooltipIconButton from './TooltipIconButton';

interface SettingsCardTextFieldProps {
	index: number,
	name: string;
	required: boolean;
	value: string | number;
	hasLabel?: boolean;
	hasHint?: boolean;
	hasTooltip?: boolean;
	updateItem: (index: number, fieldName: string, value: string | number) => void,
	type?: string,
}

const SettingsCardTextField = ({ index, name, required, value, hasLabel, hasHint, hasTooltip, updateItem, type = 'text' }: SettingsCardTextFieldProps) => {
	const { formatMessage } = useIntl();
	const [hasError, setHasError] = useState(false);

	const onItemChange = (newValue: string) => {
		setHasError(required && !newValue);
		updateItem(index, name, newValue);
	}

	const label = hasLabel ? formatMessage({ id: getTrad(`plugin.settings.${name}`) }) : "";
	const hint = hasHint ? formatMessage({ id: getTrad(`plugin.settings.${name}.hint`) }) : "";
	const tooltip = hasTooltip ? formatMessage({ id: getTrad(`plugin.settings.${name}.tooltip`) }) : "";

	const placeholder = formatMessage({ id: getTrad(`plugin.settings.${name}.placeholder`) });

	return (
		<Field.Root name={`field_${name}`} required={required}
			error={hasError ? formatMessage({ id: getTrad("plugin.settings.errors.required") }) : ""}
			hint={hint}
		>
			{label && <Field.Label>
				{label}
			</Field.Label>}
			<Flex justifyContent="space-between">
				<Box style={{ width: '100%' }}>
					<TextInput
						name={name}
						placeholder={placeholder}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => onItemChange(e.target.value)}
						value={value}
						type={type}
					/>
				</Box>
				{tooltip && <Box marginLeft={2}>
					<TooltipIconButton label={tooltip} showBorder={true} variant='ghost'>
						<Information />
					</TooltipIconButton>
				</Box>}
			</Flex>
			{hint && <Field.Hint />}
			<Field.Error />

		</Field.Root>
	);
}

export default SettingsCardTextField;