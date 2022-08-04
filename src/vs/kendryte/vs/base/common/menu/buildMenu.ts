import {
    // ACTION_CATEGORY_BUILD_DEBUG,
    ACTION_ID_MAIX_CMAKE_BUILD,
    ACTION_ID_MAIX_CMAKE_BUILD_DEBUG,
    ACTION_ID_MAIX_CMAKE_BUILD_RUN,
    ACTION_ID_MAIX_CMAKE_CLEANUP,
    ACTION_ID_MAIX_CMAKE_DEBUG,
    ACTION_ID_MAIX_CMAKE_RUN,
    ACTION_LABEL_MAIX_CMAKE_BUILD,
    ACTION_LABEL_MAIX_CMAKE_BUILD_DEBUG,
    ACTION_LABEL_MAIX_CMAKE_BUILD_RUN,
    ACTION_LABEL_MAIX_CMAKE_CLEANUP,
    ACTION_LABEL_MAIX_CMAKE_DEBUG,
    ACTION_LABEL_MAIX_CMAKE_RUN,
} from 'vs/kendryte/vs/base/common/menu/cmake';

export class MyMenuSeparator {
    public readonly separator = true;

    constructor(
        public readonly id: string,
    ) { }
}

export class MyMenu {

    constructor(
        public readonly commandId: string,
        public readonly title: string,
    ) { }
}

export class MySubMenu {
    constructor(
        public readonly title: string,
        public readonly submenu: ReadonlyArray<MyMenuElement>,
    ) { }
}

export type MyMenuElement = (MyMenu | MyMenuSeparator | MySubMenu | null);
export type MyMenuRegistry = ReadonlyArray<MyMenuElement>;

export const ApplicationMenuStructure: MyMenuRegistry = [
    new MyMenuSeparator('Build'),
    new MyMenu(ACTION_ID_MAIX_CMAKE_CLEANUP, ACTION_LABEL_MAIX_CMAKE_CLEANUP),
    new MyMenu(ACTION_ID_MAIX_CMAKE_BUILD, ACTION_LABEL_MAIX_CMAKE_BUILD),
    new MyMenuSeparator('run'),
    new MyMenu(ACTION_ID_MAIX_CMAKE_BUILD_DEBUG, ACTION_LABEL_MAIX_CMAKE_BUILD_DEBUG),
    new MyMenu(ACTION_ID_MAIX_CMAKE_DEBUG, ACTION_LABEL_MAIX_CMAKE_DEBUG),
    new MyMenu(ACTION_ID_MAIX_CMAKE_BUILD_RUN, ACTION_LABEL_MAIX_CMAKE_BUILD_RUN),
    new MyMenu(ACTION_ID_MAIX_CMAKE_RUN, ACTION_LABEL_MAIX_CMAKE_RUN),
];
