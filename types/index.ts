import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;






import {
  Control,
  FieldError,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";


// Backend API response type
export interface ApiResponse<T = undefined> {
  status: string;
  message: string;
  response?: T;
}

export interface LoginUserInput{
  username: string;
  password: string;
}

export interface RegisterUserInput extends LoginUserInput {
  confirmPassword: string;
}

export interface ResetPasswordInput {
  password: string;
}



// api response type for client
export interface ClientApiResponse<T = undefined> {
  response?: T;
  error: string | null;
}

// API error type
export interface ApiError {
  message: string;
  status: string;
}

//type guard to determine if the error object conforms to the ApiError structure
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
};

// type for the API call function
export type ApiRequest<T> = (abortSignal: AbortSignal) => Promise<T>;

// type for the useApi hook return value
export interface ApiHandlerResult {
  isLoading: boolean;
  handleApi: <T>(apiRequest: ApiRequest<T>) => Promise<ClientApiResponse<T>>;
}

//shared types
export interface ImageData {
  url: string;
  publicId: string;
}

interface PaginationMetaData {
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface Params {
  page: number;
  perPage: number;
  sortBy?: string;
  orderBy?: string;
}



// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileThumbnail: ImageData | null;
  profileImage: ImageData | null;
  password?: string;
  tokens?: AuthTokens;

}

interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export type UpdateUserInput = Partial<Pick<User, "firstName" | "lastName">> & {
  profileImage?: string;
};

export type UserProfileFormInput = Required<
  Pick<User, "firstName" | "lastName" | "email">
> & {
  profileImage?: File | null;
};


export type ForgotPasswordInput = Pick<User, "email">;







export type PostDurationsPayload = Duration[];



export interface PostParams extends Params {
  searchBy?: string;
}



export type CommentPayload = Required<Omit<Comment, "creator">>;

export type CommentData = Required<
  Omit<Comment, "postId" | "userId" | "parentCommentId">
>;
export interface CommentsPayload {
  data: CommentData[];
  metaData: PaginationMetaData;
}



//Component Props types

// Define the props interface for the ErrorFallback component
export interface ErrorFallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

// Define the props interface for the PasswordResetModal component
export interface PasswordResetModalProps {
  onClose: () => void;
  onResend: (email: string) => void;
  userEmail: string | null;
  isSendingResetEmail: boolean;
}

// Define the props interface for the Layout components
interface LayoutProps {
  redirectPath?: string;
}

export type AuthLayoutProps = LayoutProps;
export type PublicLayoutProps = LayoutProps;





// Define the props interface for the PaginationNav component
export interface PaginationNavProps {
  className?: string;
}

// Define the props interface for the ProfileAvatar component
export interface ProfileAvatarProps {
  imageUrl: string;
  userName: string;
  className?: string;
  avatarSize?: string;
  avatarTextSize?: string;
}

// Define the props interface for the ProfileDropdown component
export interface ProfileDropdownProps {
  user: User;
  handleSignOut: () => void;
}

// Define the props interface for the ReturnLink component
export interface ReturnLinkProps {
  to: string;
}





// Define the props interface for the FormFieldError component
export interface FormFieldErrorProps {
  errorMessage: string;
  className?: string;
}







// Define the interface for InitialsAvatar Component
export interface InitialsAvatarProps {
  userName: string;
  avatarSize?: string;
  avatarTextSize?: string;
}

// Define the interface for LoadingOverlay Component
export interface LoadingOverlayProps {
  className?: string;
  loaderColor?: string;
  isLoading?: boolean;
}

// Define the props interface for the FormCheckbox component
export type FormCheckboxProps<T extends FieldValues> = {
  name: string;
  control: Control<T>;
  label: string;
} & UseControllerProps<T>;

// Define the props interface for the FormDropdown component
export interface FormDropdownProps<T> {
  label: string;
  items: T[];
  selectedValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  valueKey: keyof T;
  labelKey: keyof T;
  error?: FieldError;
}

// Define the props interface for the FormFileUpload component
export type FormFileUploadProps<T extends FieldValues> = {
  name: string;
  control: Control<T>;
  selectedImage: string | null;
  setSelectedImage: (selectedImg: string | null) => void;
  className?: string;
} & UseControllerProps<T>;

// Define the props interface for the FormInputField component
export type FormInputFieldProps<T extends FieldValues> = {
  name: string;
  type?: string;
  placeholder?: string;
  control: Control<T>;
  label: string;
  className?: string;
  disabled?: boolean;
} & UseControllerProps<T>;

// Define the props interface for the FormTextEditor component
export type FormTextEditorProps<T extends FieldValues> = {
  name: string;
  control: Control<T>;
  label: string;
  minHeight?: number;
  maxHeight?: number;
} & UseControllerProps<T>;

// Action Interface for reducers
interface Action<T extends string, P = undefined> {
  type: T;
  payload: P;
}

// enum for AuthActionType
export enum AuthActionType {
  SET_USER = "SET_USER",
  LOG_IN = "LOG_IN",
  LOG_OUT = "LOG_OUT",
}



// Auth Action type for Auth Reducer
export type AuthAction =
  | Action<AuthActionType.SET_USER, User>

  | Action<AuthActionType.LOG_OUT>;


