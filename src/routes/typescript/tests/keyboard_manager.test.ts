import { ApplicationAction, doesContainSameElements, getShortcutAction, ModifierKey } from "../keyboard_manager"

test('get_shortcut_1', () => {
    let shortcut = { primaryKey: ["t"], modifierKey: [ModifierKey.CTRL] }
    expect(getShortcutAction(shortcut)).toBe(ApplicationAction.OPEN_COMMAND_BAR);
})

test('get_shortcut_2', () => {
    let shortcut = { primaryKey: ["c"], modifierKey: [ModifierKey.CTRL] }
    expect(getShortcutAction(shortcut)).toBe(ApplicationAction.TEST);
})

test('does_equal_function_number_equal', () => {
    expect(doesContainSameElements<number>([2,6,1], [1,6,2])).toBe(true)
})
test('does_equal_function_number_not_equal', () => {
    expect(doesContainSameElements<number>([2,6,1], [1,5,2])).toBe(false)
})
test('does_equal_function_string_equal', () => {
    expect(doesContainSameElements<string>(['s', 'j', 'b'], ['j', 's', 'b'])).toBe(true)
})

test('does_equal_function_string_not_equal', () => {
    expect(doesContainSameElements<string>(['s', 'c', 'b'], ['j', 's', 'b'])).toBe(false)
})
