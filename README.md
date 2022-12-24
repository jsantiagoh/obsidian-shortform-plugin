# Obsidian Shortform plugin

Unnoficial __AND VERY BETA__ [shortform](https://shortform.com) plugin for [obsidian](https://obsidian.md).

Download highlights from Shortform into Obsidian.

DISCLAIMERS: This is at POC level, it may destroy your vault and you can't say I didn't warn you. Also, I'm not a typescript/javascript/frontend developer

Please check the settings window before syncing to setup the application key and the directory to use.

## Getting the application key

Maybe someday this will be a login inside obsidian, but for now you'll have to extract it from your browser *after* you log into shortform. Extract it from one of

- Local storage as 'https://www.shortform.com' and get the value of the item `auth_token`
- Follow the much more clearer instructions on [Nicole van der Hoeven's blog](https://nicolevanderhoeven.com/blog/20210815-shortform-to-readwise/)

Once you have this, just go to Settings and store that value there.

## Mission statement

- Your data is yours forever

### Regarding the plugin

- Keep the code as simple and straighforward as possible, with the fewer amount of dependencies possible.

