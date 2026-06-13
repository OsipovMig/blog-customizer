import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { RadioGroup } from 'src/ui/radio-group';

import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	ArticleStateType,
	OptionType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

const GAP_HEIGHT = '50px';

interface ArticleParamsFormProps {
	onApply: (state: ArticleStateType) => void;
	currentAppState: ArticleStateType;
}

export const ArticleParamsForm = ({
	onApply,
	currentAppState,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const formRef = useRef<HTMLDivElement>(null);

	// Все состояния настроены строго с индексами [0] по вашему правилу
	const [fontFamily, setFontFamily] = useState<OptionType>(
		fontFamilyOptions[0]
	);
	const [fontSize, setFontSize] = useState<OptionType>(fontSizeOptions[0]);
	const [fontColor, setFontColor] = useState<OptionType>(fontColors[0]);
	const [backgroundColor, setBackgroundColor] = useState<OptionType>(
		backgroundColors[0]
	);
	const [contentWidth, setContentWidth] = useState<OptionType>(
		contentWidthArr[0]
	);

	const toggleForm = () => {
		setIsOpen(!isOpen);
	};

	// Синхронизация формы с текущим состоянием статьи при открытии сайдбара
	useEffect(() => {
		if (isOpen) {
			setFontFamily(currentAppState.fontFamilyOption);
			setFontSize(currentAppState.fontSizeOption);
			setFontColor(currentAppState.fontColor);
			setBackgroundColor(currentAppState.backgroundColor);
			setContentWidth(currentAppState.contentWidth);
		}
	}, [isOpen, currentAppState]);

	// Функция применения настроек (чистая () => void)
	const handleSubmit = () => {
		const newState: ArticleStateType = {
			fontFamilyOption: fontFamily,
			fontSizeOption: fontSize,
			fontColor: fontColor,
			backgroundColor: backgroundColor,
			contentWidth: contentWidth,
		};

		onApply(newState);
	};

	// Функция сброса настроек (чистая () => void)
	const handleReset = () => {
		setFontFamily(defaultArticleState.fontFamilyOption);
		setFontSize(defaultArticleState.fontSizeOption);
		setFontColor(defaultArticleState.fontColor);
		setBackgroundColor(defaultArticleState.backgroundColor);
		setContentWidth(defaultArticleState.contentWidth);

		onApply(defaultArticleState);
	};

	// Закрытие по клику вне сайдбара
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (formRef.current && !formRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div ref={formRef}>
			<ArrowButton isOpen={isOpen} onClick={toggleForm} />
			<aside
				className={clsx(styles.container, isOpen && styles.container_open)}>
				<form className={styles.form} onSubmit={(e) => e.preventDefault()}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>

					<div style={{ height: GAP_HEIGHT }} />

					<Select
						selected={fontFamily}
						options={fontFamilyOptions}
						onChange={setFontFamily}
						title='Шрифт'
					/>

					<div style={{ height: GAP_HEIGHT }} />

					<RadioGroup
						name='fontSize'
						options={fontSizeOptions}
						selected={fontSize}
						onChange={setFontSize}
						title='Размер шрифта'
					/>

					<div style={{ height: GAP_HEIGHT }} />

					<Select
						selected={fontColor}
						options={fontColors}
						onChange={setFontColor}
						title='Цвет шрифта'
					/>

					<div style={{ height: GAP_HEIGHT }} />
					<Separator />
					<div style={{ height: GAP_HEIGHT }} />

					<Select
						selected={backgroundColor}
						options={backgroundColors}
						onChange={setBackgroundColor}
						title='Цвет фона'
					/>

					<div style={{ height: GAP_HEIGHT }} />

					<Select
						selected={contentWidth}
						options={contentWidthArr}
						onChange={setContentWidth}
						title='Ширина контента'
					/>

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='button'
							type='clear'
							onClick={handleReset}
						/>
						<Button
							title='Применить'
							htmlType='button'
							type='apply'
							onClick={handleSubmit}
						/>
					</div>
				</form>
			</aside>
		</div>
	);
};
