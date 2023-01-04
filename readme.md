# Automatic Updater for Mario Kart Wii's Players' Page and Mario Kart Leaderboards

### Table of Contents
* [What is this?](#what-is-this)
* [How do I download this?](#how-do-i-download-this)
* [Changelog](#changelog)


## What is this?
| Icon used. Courtesy of u/asblack98 on [this reddit post](https://www.reddit.com/r/MarioKartWii/comments/s41kw9/funky_kong_stadium_logo_remade/) | [![Logo](https://github.com/FallBackITA27/Auto-Updater-MKL-MKWPP/blob/main/images/128p_icon.png?raw=true)](https://github.com/FallBackITA27/Auto-Updater-MKL-MKWPP) |
|-|-|

This is a Chrome Extension (Firefox soon? 👀) that grabs times from a [Chadsoft profile](https://www.chadsoft.co.uk/time-trials/players/1F/7B7D3331A3A008.html#sort-by-date) and compares it to an [MKWPP profile](https://www.mariokart64.com/mkw/profile.php) or an [MKL profile](https://www.mkleaderboards.com/mkw/players/2450).
### Feature list?
* [Automatically submit 3lap times to MKL](#automatically-submit-3lap-times-to-mkl)
* [Automatically submit times to MKWPP](#automatically-submit-times-to-mkwpp)

#### Automatically submit 3lap times to MKL
Open the Extension's popup by clicking on its icon. Then, save your Chadsoft account and click on "Submit to MKL".

![Tut1](https://i.imgur.com/Zw9bVHl.png)

This will give you a prompt to go to [MKL](https://mariokartleaderboards.com/). Once there, click "Submit to MKL" again. (There's technical reasons to why this is needed, I'll change it in the future when I'm done with more important stuff).

Once there, pick one of the MKW Categories.

![Tut2](https://i.imgur.com/84MNcJP.png)

Once done, it'll fill the info on its own, all you have to do is double check and click on submit.

#### Automatically submit times to MKWPP
Open the Extension's popup by clicking on its icon. Then, save your Chadsoft and MKWPP accounts and click on "Submit to MKWPP".

![Tut1](https://i.imgur.com/YfTaazV.png)

This will give you a prompt to go to the [MKWPP](https://mariokart64.com/mkw). Once there, click "Submit to MKWPP" again. (There's technical reasons to why this is needed, I'll change it in the future when I'm done with more important stuff).

Wait a few seconds, then, another prompt will pop up, to tell you that it has gotten the text for you to send in the submission chat.

![Tut2](https://i.imgur.com/kXaIUho.png) ![Tut3](https://i.imgur.com/3sTFS1R.png) ![Tut4](https://i.imgur.com/RbdiL8D.png)


## How do I download this?
Sadly, I can't put this on the Chrome Webstore, so you have two options:
### 1
You download the repo as a .zip

![Zip DL](https://i.imgur.com/b3VwKA8.png)

Then you extract it in your folder of choice

![Extract](https://i.imgur.com/CgfAhS7.png)

Then you go to your browser's of choice extension page, it should be \<browserNameHere\>://extensions (KEEP IN MIND THAT THIS IS MADE FOR [CHROMIUM BASED BROWSERS!](https://en.wikipedia.org/wiki/Chromium_(web_browser)#Browsers_based_on_Chromium))

![Extensions page](https://i.imgur.com/5ziR16P.png)

You turn on developer mode, you click "load unpacked", and select the folder you extracted the extension in.

### 2
You could donate 5$ for me to publish on the Webstore!

![Webstore 5USD](https://i.imgur.com/16XErKN.png)

(Not yet ready, I'm not 18 and don't have a PayPal yet lol)

## Changelog

### Versions:
* [1.1.3](#113)
* [1.1.2](#112)
* [1.1.1](#111)
* [1.1.0](#110)
* [1.0.4](#104)
* [1.0.3](#103)
* [1.0.2](#102)
* [1.0.1](#101)
* [1.0.0](#100)

### 1.1.3
* Cross Checking Normal Categories, Shortcut and Glitch.
### 1.1.2
* The script now looks for updates once a day. --FalB
### 1.1.1
* Bugfixes
    * I forgot to write "flap" on flap only submissions lol --FalB
### 1.1.0
* Fixed "Undeletable" MKL form fill-ins --FalB
    * This is awkward to admit. The way the script decides whether to fill is every two seconds it checks the category that is selected and fills accordingly. I did not think about what happens if one wants to delete what's written there. Now it only fills if the category has changed in the last two seconds. Why the two second check? Originally I wanted to make it so that the script would fire every time that the category is changed, but sadly the form takes a little bit more to update, so it would break everything.
* Added date support for MKWPP! --FalB
* Added flap support for MKWPP! --FalB
### 1.0.4
* Bugfix, I accidentally pushed unfinished code. --FalB
### 1.0.3
* Dealt with (aka worked around) the MKWPP CORS Policy --FalB
### 1.0.2
* Fixed various bugs regarding storing Chadsoft and MKWPP profile --FalB
### 1.0.1
* Italian Localization added --FalB
### 1.0.0
* Initial release --FalB
* Added updating for 3lap both on [MKL](#automatically-submit-3lap-times-to-mkl) and [MKWPP](#automatically-submit-times-to-mkwpp). --FalB
