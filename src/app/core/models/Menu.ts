
export interface ChildrenItems {
    state: string;
    name: string;
    type?: string;
    icon?: string;
    iconType?: string;
    order?: number;
  }

  export interface MenuItem {
    state: string;
    name: string;
    type: string;
    icon: string;
    iconType?: string;
    order?: number;
    children?: ChildrenItems[];
  }
