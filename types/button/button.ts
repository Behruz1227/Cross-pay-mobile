export interface IButton {
    title: string | JSX.Element;
    backgroundColor?: string;
    textColor?: string;
    textSize?: number;
    onPress?: () => void;
    bordered?: boolean;
    isDisebled?: boolean;
    icon?: any;
    loading?: boolean
}