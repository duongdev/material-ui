import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { deepmerge } from '@material-ui/utils';
import { unstable_composeClasses as composeClasses } from '@material-ui/unstyled';
import capitalize from '../utils/capitalize';
import Modal from '../Modal';
import Fade from '../Fade';
import { duration } from '../styles/transitions';
import Paper from '../Paper';
import useThemeProps from '../styles/useThemeProps';
import experimentalStyled from '../styles/experimentalStyled';
import dialogClasses, { getDialogUtilityClass } from './dialogClasses';

const overridesResolver = (props, styles) => {
  const { styleProps } = props;

  return deepmerge(
    {
      [`& .${dialogClasses.container}`]: {
        ...styles.container,
        ...styles[`scroll${capitalize(styleProps.scroll)}`],
      },
      [`& .${dialogClasses.paper}`]: {
        ...styles.paper,
        ...styles[`scrollPaper${capitalize(styleProps.scroll)}`],
        ...styles[`paperWidth${capitalize(String(styleProps.maxWidth))})`],
        ...(styleProps.fullWidth && styles.paperFullWidth),
        ...(styleProps.fullScreen && styles.paperFullScreen),
      },
    },
    styles.root || {},
  );
};

const useUtilityClasses = (styleProps) => {
  const { classes, scroll, maxWidth, fullWidth, fullScreen } = styleProps;

  const slots = {
    root: ['root'],
    container: ['container', `scroll${capitalize(scroll)}`],
    paper: [
      'paper',
      `paperScroll${capitalize(scroll)}`,
      `paperWidth${capitalize(String(maxWidth))}`,
      fullWidth && 'paperFullWidth',
      fullScreen && 'paperFullScreen',
    ],
  };

  return composeClasses(slots, getDialogUtilityClass, classes);
};

const DialogRoot = experimentalStyled(
  Modal,
  {},
  {
    name: 'MuiDialog',
    slot: 'Root',
    overridesResolver,
  },
)({
  /* Styles applied to the root element. */
  '@media print': {
    // Use !important to override the Modal inline-style.
    position: 'absolute !important',
  },
});

const DialogContainer = experimentalStyled(
  'div',
  {},
  {
    name: 'MuiDialog',
    slog: 'Container',
  },
)(({ styleProps }) => ({
  /* Styles applied to the container element. */
  height: '100%',
  '@media print': {
    height: 'auto',
  },
  // We disable the focus ring for mouse, touch and keyboard users.
  outline: 0,
  /* Styles applied to the container element if `scroll="paper"`. */
  ...(styleProps.scroll === 'paper' && {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  /* Styles applied to the container element if `scroll="body"`. */
  ...(styleProps.scroll === 'body' && {
    overflowY: 'auto',
    overflowX: 'hidden',
    textAlign: 'center',
    '&:after': {
      content: '""',
      display: 'inline-block',
      verticalAlign: 'middle',
      height: '100%',
      width: '0',
    },
  }),
}));

const DialogPaper = experimentalStyled(
  Paper,
  {},
  {
    name: 'MuiDialog',
    slot: 'Paper',
  },
)(({ theme, styleProps }) => ({
  /* Styles applied to the Paper component. */
  margin: 32,
  position: 'relative',
  overflowY: 'auto', // Fix IE11 issue, to remove at some point.
  '@media print': {
    overflowY: 'visible',
    boxShadow: 'none',
  },
  /* Styles applied to the Paper component if `scroll="paper"`. */
  ...(styleProps.scroll === 'paper' && {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100% - 64px)',
  }),
  /* Styles applied to the Paper component if `scroll="body"`. */
  ...(styleProps.scroll === 'body' && {
    display: 'inline-block',
    verticalAlign: 'middle',
    textAlign: 'left', // 'initial' doesn't work on IE11
  }),
  /* Styles applied to the Paper component if `maxWidth=false`. */
  ...(!styleProps.maxWidth && {
    maxWidth: 'calc(100% - 64px)',
  }),
  /* Styles applied to the Paper component if `maxWidth="xs"`. */
  ...(styleProps.maxWidth === 'xs' && {
    maxWidth: Math.max(theme.breakpoints.values.xs, 444),
    [`&.${dialogClasses.paperScrollBody}`]: {
      [theme.breakpoints.down(Math.max(theme.breakpoints.values.xs, 444) + 32 * 2)]: {
        maxWidth: 'calc(100% - 64px)',
      },
    },
  }),
  /* Styles applied to the Paper component if `maxWidth="sm"`. */
  ...(styleProps.maxWidth === 'sm' && {
    maxWidth: theme.breakpoints.values.sm,
    [`&.${dialogClasses.paperScrollBody}`]: {
      [theme.breakpoints.down(theme.breakpoints.values.sm + 32 * 2)]: {
        maxWidth: 'calc(100% - 64px)',
      },
    },
  }),
  /* Styles applied to the Paper component if `maxWidth="md"`. */
  ...(styleProps.maxWidth === 'md' && {
    maxWidth: theme.breakpoints.values.md,
    [`&.${dialogClasses.paperScrollBody}`]: {
      [theme.breakpoints.down(theme.breakpoints.values.md + 32 * 2)]: {
        maxWidth: 'calc(100% - 64px)',
      },
    },
  }),
  /* Styles applied to the Paper component if `maxWidth="lg"`. */
  ...(styleProps.maxWidth === 'lg' && {
    maxWidth: theme.breakpoints.values.lg,
    [`&.${dialogClasses.paperScrollBody}`]: {
      [theme.breakpoints.down(theme.breakpoints.values.lg + 32 * 2)]: {
        maxWidth: 'calc(100% - 64px)',
      },
    },
  }),
  /* Styles applied to the Paper component if `maxWidth="xl"`. */
  ...(styleProps.maxWidth === 'xl' && {
    maxWidth: theme.breakpoints.values.xl,
    [`&.${dialogClasses.paperScrollBody}`]: {
      [theme.breakpoints.down(theme.breakpoints.values.xl + 32 * 2)]: {
        maxWidth: 'calc(100% - 64px)',
      },
    },
  }),
  /* Styles applied to the Paper component if `fullWidth={true}`. */
  ...(styleProps.fullWidth && {
    width: 'calc(100% - 64px)',
  }),
  /* Styles applied to the Paper component if `fullScreen={true}`. */
  ...(styleProps.fullScreen && {
    margin: 0,
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    maxHeight: 'none',
    borderRadius: 0,
    [`&.${dialogClasses.paperScrollBody}`]: {
      margin: 0,
      maxWidth: '100%',
    },
  }),
}));

const defaultTransitionDuration = { enter: duration.enteringScreen, exit: duration.leavingScreen };
/**
 * Dialogs are overlaid modal paper based components with a backdrop.
 */
const Dialog = React.forwardRef(function Dialog(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiDialog' });
  const {
    'aria-describedby': ariaDescribedby,
    'aria-labelledby': ariaLabelledby,
    BackdropProps,
    children,
    className,
    disableEscapeKeyDown = false,
    fullScreen = false,
    fullWidth = false,
    maxWidth = 'sm',
    onBackdropClick,
    onClose,
    open,
    PaperComponent = Paper,
    PaperProps = {},
    scroll = 'paper',
    TransitionComponent = Fade,
    transitionDuration = defaultTransitionDuration,
    TransitionProps,
    ...other
  } = props;

  const styleProps = {
    ...props,
    disableEscapeKeyDown,
    fullScreen,
    fullWidth,
    maxWidth,
    scroll,
  };

  const classes = useUtilityClasses(styleProps);

  const backdropClick = React.useRef();
  const handleMouseDown = (event) => {
    // We don't want to close the dialog when clicking the dialog content.
    // Make sure the event starts and ends on the same DOM element.
    backdropClick.current = event.target === event.currentTarget;
  };
  const handleBackdropClick = (event) => {
    // Ignore the events not coming from the "backdrop".
    if (!backdropClick.current) {
      return;
    }

    backdropClick.current = null;

    if (onBackdropClick) {
      onBackdropClick(event);
    }

    if (onClose) {
      onClose(event, 'backdropClick');
    }
  };

  return (
    <DialogRoot
      className={clsx(classes.root, className)}
      BackdropProps={{
        transitionDuration,
        ...BackdropProps,
      }}
      closeAfterTransition
      disableEscapeKeyDown={disableEscapeKeyDown}
      onClose={onClose}
      open={open}
      ref={ref}
      onClick={handleBackdropClick}
      styleProps={styleProps}
      {...other}
    >
      <TransitionComponent
        appear
        in={open}
        timeout={transitionDuration}
        role="presentation"
        {...TransitionProps}
      >
        {/* roles are applied via cloneElement from TransitionComponent */}
        {/* roles needs to be applied on the immediate child of Modal or it'll inject one */}
        <DialogContainer
          className={clsx(classes.container)}
          onMouseDown={handleMouseDown}
          styleProps={styleProps}
        >
          <DialogPaper
            as={PaperComponent}
            elevation={24}
            role="dialog"
            aria-describedby={ariaDescribedby}
            aria-labelledby={ariaLabelledby}
            {...PaperProps}
            className={clsx(classes.paper, PaperProps.className)}
            styleProps={styleProps}
          >
            {children}
          </DialogPaper>
        </DialogContainer>
      </TransitionComponent>
    </DialogRoot>
  );
});

Dialog.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The id(s) of the element(s) that describe the dialog.
   */
  'aria-describedby': PropTypes.string,
  /**
   * The id(s) of the element(s) that label the dialog.
   */
  'aria-labelledby': PropTypes.string,
  /**
   * @ignore
   */
  BackdropProps: PropTypes.object,
  /**
   * Dialog children, usually the included sub-components.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * If `true`, hitting escape will not fire the `onClose` callback.
   * @default false
   */
  disableEscapeKeyDown: PropTypes.bool,
  /**
   * If `true`, the dialog is full-screen.
   * @default false
   */
  fullScreen: PropTypes.bool,
  /**
   * If `true`, the dialog stretches to `maxWidth`.
   *
   * Notice that the dialog width grow is limited by the default margin.
   * @default false
   */
  fullWidth: PropTypes.bool,
  /**
   * Determine the max-width of the dialog.
   * The dialog width grows with the size of the screen.
   * Set to `false` to disable `maxWidth`.
   * @default 'sm'
   */
  maxWidth: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs', false]),
  /**
   * Callback fired when the backdrop is clicked.
   */
  onBackdropClick: PropTypes.func,
  /**
   * Callback fired when the component requests to be closed.
   *
   * @param {object} event The event source of the callback.
   * @param {string} reason Can be: `"escapeKeyDown"`, `"backdropClick"`.
   */
  onClose: PropTypes.func,
  /**
   * If `true`, the component is shown.
   */
  open: PropTypes.bool.isRequired,
  /**
   * The component used to render the body of the dialog.
   * @default Paper
   */
  PaperComponent: PropTypes.elementType,
  /**
   * Props applied to the [`Paper`](/api/paper/) element.
   * @default {}
   */
  PaperProps: PropTypes.object,
  /**
   * Determine the container for scrolling the dialog.
   * @default 'paper'
   */
  scroll: PropTypes.oneOf(['body', 'paper']),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.object,
  /**
   * The component used for the transition.
   * [Follow this guide](/components/transitions/#transitioncomponent-prop) to learn more about the requirements for this component.
   * @default Fade
   */
  TransitionComponent: PropTypes.elementType,
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   * @default { enter: duration.enteringScreen, exit: duration.leavingScreen }
   */
  transitionDuration: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      appear: PropTypes.number,
      enter: PropTypes.number,
      exit: PropTypes.number,
    }),
  ]),
  /**
   * Props applied to the transition element.
   * By default, the element is based on this [`Transition`](http://reactcommunity.org/react-transition-group/transition) component.
   */
  TransitionProps: PropTypes.object,
};

export default Dialog;
