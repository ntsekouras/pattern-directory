/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Placeholder } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

export default function MediaPlaceholder( {
	addToGallery,
	allowedTypes = [],
	className,
	children,
	disableMediaButtons,
	icon,
	isAppender,
	labels = {},
	mediaPreview,
	multiple = false,
	notices,
	onDoubleClick,
	onSelect,
	placeholder,
	style,
	value = {},
} ) {
	if ( disableMediaButtons ) {
		return null;
	}

	const onlyAllowsImages = () => {
		if ( ! allowedTypes || allowedTypes.length === 0 ) {
			return false;
		}

		return allowedTypes.every(
			( allowedType ) => allowedType === 'image' || allowedType.startsWith( 'image/' )
		);
	};

	const [ firstAllowedType ] = allowedTypes;
	const isOneType = 1 === allowedTypes.length;
	const isAudio = isOneType && 'audio' === firstAllowedType;
	const isImage = isOneType && 'image' === firstAllowedType;
	const isVideo = isOneType && 'video' === firstAllowedType;

	const defaultRenderPlaceholder = ( content ) => {
		let title = labels.title;
		if ( title === undefined ) {
			if ( isAudio ) {
				title = __( 'Audio', 'wporg-patterns' );
			} else if ( isImage ) {
				title = __( 'Image', 'wporg-patterns' );
			} else if ( isVideo ) {
				title = __( 'Video', 'wporg-patterns' );
			} else {
				title = __( 'Media', 'wporg-patterns' );
			}
		}

		const instructions = __(
			"Patterns are required to use our collection of license-free media. You won't be able to upload or link to any other media in your patterns.",
			'wporg-patterns'
		);

		const placeholderClassName = classnames( 'block-editor-media-placeholder', className, {
			'is-appender': isAppender,
		} );

		return (
			<Placeholder
				icon={ icon }
				label={ title }
				instructions={ instructions }
				className={ placeholderClassName }
				notices={ notices }
				onDoubleClick={ onDoubleClick }
				preview={ mediaPreview }
				style={ style }
			>
				{ content }
				{ children }
			</Placeholder>
		);
	};
	const renderPlaceholder = placeholder ?? defaultRenderPlaceholder;

	const mediaLibraryButton = (
		<MediaUpload
			addToGallery={ addToGallery }
			gallery={ multiple && onlyAllowsImages() }
			multiple={ multiple }
			onSelect={ onSelect }
			allowedTypes={ allowedTypes }
			value={ Array.isArray( value ) ? value.map( ( { id } ) => id ) : value.id }
			render={ ( { open } ) => (
				<Button
					variant="primary"
					onClick={ () => {
						open();
					} }
				>
					{ __( 'Media Library', 'wporg-patterns' ) }
				</Button>
			) }
		/>
	);

	const content = renderPlaceholder( mediaLibraryButton );
	return <MediaUploadCheck fallback={ content }>{ content }</MediaUploadCheck>;
}