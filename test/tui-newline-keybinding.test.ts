import { describe, expect, test } from "bun:test";
import { KeybindingsManager, matchesKey, TUI_KEYBINDINGS } from "@earendil-works/pi-tui";

import { newLineKeybindings } from "../packages/zcode-tui/src/index.ts";

describe("newline keybindings", () => {
  test("alt+enter is accepted alongside the pi-tui defaults", () => {
    const keybindings = new KeybindingsManager(TUI_KEYBINDINGS, {
      "tui.input.newLine": newLineKeybindings
    });

    // Standard Shift+Enter (kitty CSI u) and Ctrl+J keep working.
    expect(keybindings.matches("\x1b[13;2u", "tui.input.newLine")).toBe(true);
    expect(keybindings.matches("\x1b[106;5:1u", "tui.input.newLine")).toBe(true);
    expect(matchesKey("\n", "ctrl+j")).toBe(true);

    // Terminals and relays that deliver Shift+Enter as Alt+Enter.
    expect(keybindings.matches("\x1b[13;3u", "tui.input.newLine")).toBe(true);
    expect(matchesKey("\x1b\r", "alt+enter")).toBe(true);

    // Plain Enter must still submit, never newline.
    expect(keybindings.matches("\r", "tui.input.newLine")).toBe(false);
    expect(keybindings.matches("\x1b[13;5u", "tui.input.newLine")).toBe(false);
  });
});
