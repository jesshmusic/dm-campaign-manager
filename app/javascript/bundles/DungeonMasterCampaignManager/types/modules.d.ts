declare module 'react-window' {
  import { ComponentType, ReactElement } from 'react';

  export interface ListChildComponentProps {
    index: number;
    style: React.CSSProperties;
    data?: any;
  }

  export interface FixedSizeListProps {
    children: ComponentType<ListChildComponentProps>;
    height: number;
    itemCount: number;
    itemSize: number;
    width?: number | string;
    initialScrollOffset?: number;
  }

  export class FixedSizeList extends React.Component<FixedSizeListProps> {}
}

declare module 'react-helmet' {
  import { Component, ReactNode } from 'react';

  export interface HelmetProps {
    children?: ReactNode;
    title?: string;
    titleTemplate?: string;
    defaultTitle?: string;
    base?: any;
    meta?: Array<any>;
    link?: Array<any>;
    script?: Array<any>;
    noscript?: Array<any>;
    style?: Array<any>;
    htmlAttributes?: any;
    bodyAttributes?: any;
  }

  export class Helmet extends Component<HelmetProps> {}
  export default Helmet;
}

declare module 'quill-image-resize-module-react' {
  import Quill from 'quill';
  export default class ImageResize {
    constructor(quill: Quill, options?: Record<string, unknown>);
  }
}

declare module 'react-modal' {
  import { Component, ReactNode, CSSProperties } from 'react';

  export interface Props {
    isOpen: boolean;
    style?: {
      content?: CSSProperties;
      overlay?: CSSProperties;
    };
    portalClassName?: string;
    bodyOpenClassName?: string;
    htmlOpenClassName?: string;
    className?: string | { base: string; afterOpen: string; beforeClose: string };
    overlayClassName?: string | { base: string; afterOpen: string; beforeClose: string };
    appElement?: HTMLElement | null;
    onAfterOpen?: () => void;
    onAfterClose?: () => void;
    onRequestClose?: (event: React.MouseEvent | React.KeyboardEvent) => void;
    closeTimeoutMS?: number;
    ariaHideApp?: boolean;
    shouldFocusAfterRender?: boolean;
    shouldCloseOnOverlayClick?: boolean;
    shouldCloseOnEsc?: boolean;
    shouldReturnFocusAfterClose?: boolean;
    role?: string;
    contentLabel?: string;
    aria?: { [key: string]: string };
    data?: { [key: string]: string };
    testId?: string;
    id?: string;
    parentSelector?: () => HTMLElement;
    overlayRef?: (node: HTMLElement | null) => void;
    contentRef?: (node: HTMLElement | null) => void;
    children?: ReactNode;
  }

  export default class ReactModal extends Component<Props> {
    static setAppElement(element: string | HTMLElement | null): void;
  }
}

declare module 'react-grid-layout' {
  import { Component, ComponentType, ReactNode, CSSProperties } from 'react';

  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
  }

  export interface ResponsiveProps {
    autoSize?: boolean;
    breakpoints?: { [key: string]: number };
    cols?: { [key: string]: number };
    layouts?: { [key: string]: Layout[] };
    width?: number;
    rowHeight?: number;
    maxRows?: number;
    margin?: [number, number];
    containerPadding?: [number, number];
    isDraggable?: boolean;
    isResizable?: boolean;
    isBounded?: boolean;
    useCSSTransforms?: boolean;
    transformScale?: number;
    preventCollision?: boolean;
    isDroppable?: boolean;
    resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>;
    onLayoutChange?: (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => void;
    onBreakpointChange?: (newBreakpoint: string, newCols: number) => void;
    onDragStart?: (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      e: MouseEvent,
      element: HTMLElement,
    ) => void;
    onDrag?: (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      e: MouseEvent,
      element: HTMLElement,
    ) => void;
    onDragStop?: (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      e: MouseEvent,
      element: HTMLElement,
    ) => void;
    onResizeStart?: (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      e: MouseEvent,
      element: HTMLElement,
    ) => void;
    onResize?: (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      e: MouseEvent,
      element: HTMLElement,
    ) => void;
    onResizeStop?: (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      e: MouseEvent,
      element: HTMLElement,
    ) => void;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    draggableHandle?: string;
    draggableCancel?: string;
    compactType?: 'vertical' | 'horizontal' | null;
  }

  export class Responsive extends Component<ResponsiveProps> {}

  export function WidthProvider<P>(component: ComponentType<P>): ComponentType<P>;
}
