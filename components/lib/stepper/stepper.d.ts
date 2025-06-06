/**
 *
 * Stepper is a component that streamlines a wizard-like workflow, organizing content into coherent steps and visually guiding users through a numbered progression in a multi-step process.
 *
 * [Live Demo](https://www.primereact.org/stepper/)
 *
 * @module stepper
 *
 */
import * as React from 'react';
import { ComponentHooks } from '../componentbase/componentbase';
import { PassThroughOptions } from '../passthrough';
import { StepperPanelPassThroughOptionType } from '../stepperpanel/stepperpanel';
import { PassThroughType } from '../utils';

export declare type StepperPassThroughOptionType = StepperPassThroughAttributes | ((options: StepperPassThroughMethodOptions) => StepperPassThroughAttributes | string) | string | null | undefined;
export declare type StepperPassThroughType<T> = PassThroughType<T, StepperPassThroughMethodOptions>;

/**
 * Custom passthrough(pt) option method.
 */
export interface StepperPassThroughMethodOptions {
    props: StepperProps;
    state: StepperState;
}

/**
 * Custom passthrough(pt) options.
 * @see {@link Stepper.pt}
 */
export interface StepperPassThroughOptions {
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: StepperPassThroughOptionType;
    /**
     * Used to pass attributes to the nav's DOM element.
     */
    nav?: StepperPassThroughOptionType;
    /**
     * Used to pass attributes to the panel container's DOM element.
     */
    panelContainer?: StepperPassThroughOptionType;
    /**
     * Used to pass attributes to the end handler's DOM element.
     */
    stepperpanel?: StepperPanelPassThroughOptionType;
    /**
     * Uses to pass attributes to the start's DOM element.
     */
    start?: StepperPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /**
     * Uses to pass attributes to the right's DOM element.
     */
    end?: StepperPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /**
     * Used to manage all lifecycle hooks
     * @see {@link ComponentHooks}
     */
    hooks?: ComponentHooks;
}

/**
 * Custom passthrough attributes for each DOM elements
 */
export interface StepperPassThroughAttributes {
    [key: string]: any;
}

/**
 * Defines current inline state in Stepper component.
 */
export interface StepperState {
    /**
     * Current active index state.
     */
    activeStep: number;
}

/**
 * Custom tab change event.
 * @see {@link StepperProps.onChange}
 */
export interface StepperChangeEvent {
    /**
     * Browser event
     */
    originalEvent: Event;
    /**
     * Index of the selected stepper panel
     */
    index: number;
}

/**
 * Defines valid properties in Stepper component.
 * @group Properties
 */
export interface StepperProps extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref'> {
    /**
     * Active step index of stepper.
     * @defaultValue 0
     */
    activeStep?: number | undefined;
    /**
     * Orientation of the stepper.
     * @defaultValue horizontal
     */
    orientation?: 'horizontal' | 'vertical' | undefined;
    /**
     * Position of the stepper panel header relative to the step number.
     */
    headerPosition?: 'top' | 'right' | 'bottom' | 'left' | undefined;
    /**
     * Whether the steps are clickable or not.
     * @defaultValue false
     */
    linear?: boolean | undefined;
    /**
     * Callback to invoke when an active panel is changed.
     */
    onChangeStep?(event: StepperChangeEvent): void;
    /**
     * The template of start section.
     */
    start?: React.ReactNode | ((props: StepperProps) => React.ReactNode);
    /**
     * The template of end section.
     */
    end?: React.ReactNode | ((props: StepperProps) => React.ReactNode);
    /**
     * Uses to pass attributes to DOM elements inside the component.
     * @type {StepperPassThroughOptions}
     */
    pt?: StepperPassThroughOptions;
    /**
     * Used to configure passthrough(pt) options of the component.
     * @type {PassThroughOptions}
     */
    ptOptions?: PassThroughOptions;
    /**
     * When enabled, it removes component related styles in the core.
     * @defaultValue false
     */
    unstyled?: boolean;
    /**
     * Used to get the child elements of the component.
     * @readonly
     */
    children?: React.ReactNode | undefined;
}

/**
 * **PrimeReact - Stepper**
 *
 * _Stepper is a component that streamlines a wizard-like workflow, organizing content into coherent steps and visually guiding users through a numbered progression in a multi-step process._
 *
 * [Live Demo](https://www.primereact.org/stepper/)
 * --- ---
 * ![PrimeReact](https://primefaces.org/cdn/primereact/images/logo-100.png)
 *
 * @group Component
 */
export declare class Stepper extends React.Component<StepperProps, any> {
    /**
     * Used to get container element.
     * @return {HTMLDivElement | null} Container element
     */
    public getElement(): HTMLDivElement | null;
    /**
     * Used to get the current active step index.
     * @return {number | undefined} Active step index
     */
    public getActiveStep(): number | undefined;
    /**
     * Used to set the active step index.
     * @param {number} step - Index of step to set as active
     */
    public setActiveStep(step: number): void;
    /**
     * Used to navigate to the next step.
     * @param {React.SyntheticEvent} [e] - Browser event
     */
    public nextCallback(e?: React.SyntheticEvent): void;
    /**
     * Used to navigate to the previous step.
     * @param {React.SyntheticEvent} [e] - Browser event
     */
    public prevCallback(e?: React.SyntheticEvent): void;
}
