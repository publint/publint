import type { Message } from './index.js'

export interface FormatMessageOptions {
  /**
   * Whether the returned string should contain color.
   * - `true`: Force has color.
   * - `false`: Force no color.
   * - `'html'`: Uses `<strong>` tags to highlight the important parts.
   * - `undefined`: Default to whether the environment supports color.
   *
   * ::: info Environment notes
   * - **Node.js**: Defaults to whether the terminal environment supports color.
   * - **Browser**: Colors are not supported in the browser. You can use `html`
   *                to highlight with HTML tags instead.
   * :::
   *
   * @default undefined
   */
  color?: boolean | 'html' | undefined
  /**
   * Whether the message should be worded in reference to the location in display.
   * Example wording style:
   * - `true`: "This field should be a string as..."
   * - `false`: "pkg.main is 123 but it should be a string as..."
   *
   * @default false
   */
  reference?: boolean
}

export declare function formatMessagePath(path: string[]): string

export declare function getPkgPathValue(
  pkg: Record<string, any>,
  path: string[],
): any

export declare function formatMessage(
  msg: Message,
  pkg: Record<string, any>,
  opts?: FormatMessageOptions,
): string | undefined
