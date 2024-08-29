export enum ReservedKey {
    ESC = "esc"
}

export enum ModifierKey {
    SHIFT = "shiftKey",
    ALT = "altKey",
    CTRL = "ctlrKey",
}

export enum ApplicationAction  {
    OPEN_COMMAND_BAR,
    TEST,
}

export enum FunctionKey {
    F1, F2, F3, F4, F5, 
    F6, F7, F8, F9, F10, 
    F11, F12
}

interface ApplicationShortcut {
    applicationAction: ApplicationAction,
    modifierKey: ModifierKey[],
    primaryKey: (string | FunctionKey)[],
}

interface KeyboardShortcut {
    modifierKey: ModifierKey[],
    primaryKey: (string | FunctionKey)[],
}

let shortcuts: ApplicationShortcut[] = [
    { applicationAction: ApplicationAction.OPEN_COMMAND_BAR, modifierKey: [ModifierKey.CTRL], primaryKey: ["t"]},
    { applicationAction: ApplicationAction.TEST, modifierKey: [ModifierKey.CTRL], primaryKey: ["c"]}
]

function getShortcutFromKeyboardEvent(e: KeyboardEvent) {
    let shortcut: KeyboardShortcut = { modifierKey: [], primaryKey: [] };
    if(e.ctrlKey) {
        shortcut.modifierKey.push(ModifierKey.CTRL)
    } else if(e.shiftKey) {
        shortcut.modifierKey.push(ModifierKey.SHIFT)
    } else if(e.altKey) {
        shortcut.modifierKey.push(ModifierKey.ALT); 
    }
}

export function getShortcutAction(shortcut: KeyboardShortcut): ApplicationAction {
    console.log(shortcuts);
    return shortcuts.filter(sc => {
        if(doesContainSameElements(sc.modifierKey, shortcut.modifierKey) &&
           doesContainSameElements(sc.primaryKey, shortcut.primaryKey) ) {
            return sc;
        }
    })[0].applicationAction //[0] because only one shortcut can exist 
}

export function doesContainSameElements<T>(arr1: T[], arr2: T[]): boolean {
    let returnVal = true;
    arr1.forEach(el => {
            if(!arr2.includes(el)) {
                returnVal = false;
                return;
            }
        }
    );
    return returnVal;
}

