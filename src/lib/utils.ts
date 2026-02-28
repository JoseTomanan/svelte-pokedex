import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };


/* ======== Utility Functions ========*/
export function getIdFromUrl(str: string): string | null {
	const parts = str.split('/');
	if (parts.length < 3) {
		return null;
	}
	const candidate = parts[parts.length - 2];
	return /^\d+$/.test(candidate) ? candidate : null;
}


export const getIdAsParam = (id: number) => id.toString().padStart(3, '0');

export const nameCase = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

export const titleCase = (str: string) => (str.replace(/-/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
);