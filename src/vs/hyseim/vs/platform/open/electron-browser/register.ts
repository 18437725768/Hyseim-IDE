import { registerExternalAction } from 'vs/hyseim/vs/workbench/actionRegistry/common/registerAction';
import { ACTION_CATEGORY_WEBLINK } from 'vs/hyseim/vs/base/common/menu/webLink';
import { OpenForumInBrowserAction } from 'vs/hyseim/vs/platform/open/common/openForumInBrowser';
import { OpenDocumentInBrowser } from 'vs/hyseim/vs/platform/open/common/openDocumentInBrowser';

registerExternalAction(ACTION_CATEGORY_WEBLINK, OpenForumInBrowserAction);
registerExternalAction(ACTION_CATEGORY_WEBLINK, OpenDocumentInBrowser);
