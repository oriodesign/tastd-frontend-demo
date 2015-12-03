# Tastd Frontend Demo

These are just few sample files. This is not the complete project.

This repository is just for interviews and to show coding skills.

## Guidelines

### Rules

1. **Define 1 component per file** (so 1 file == 1 service)
2. Use **Controller As Syntax** instead of $scope
3. Use always var ctrl = this; at the beginning of a controller
4. Place bindable elements on the top of the controller (ctrl.something ) in alphabetical order.
5. Use function declaration to hide implementation details  
6. Defer controller logic to services. Keep controller very short.

### Folders

- **app**: 
    - **config**: app parameters
    - **js**: 
        - **directives**: directives with their templates and style
        - **entities**: models and model managers
        - **filters**: angular filters
        - **listeners**: global listeners `$on`
        - **services**: every other service
        - **states**: Controllers and routing config
    - **scss**: app wide style
- **tasks**: grunt tasks 

### Naming convention

- Filename lowercase
    - Module (without anything else) `xyz.js`
    - Services: `xyz-service.js`
    - Factories: `xyz-factory.js`
    - Controllers: `xyz-controller.js`
    - Constant: `xyz-constant.js`
    - Provider: `xyz-provider.js`
    - Style: `some-name.scss`
    - Html: `some-name.html`
- Service Name (name of the function)
    - Factories: `.factory('Analytics', function AnalyticsFactory() {`
    - Controllers: `.controller('InviteHomeCtrl', function InviteHomeCtrl(`
    - Directive: `.directive(‘someName’, function SomeNameDirective(){})`
    - Provider: `.provider(‘SomeName’, function SomeNameProvider(){})`
- Module name 
    - `path/to/module` => `path.to.module.ServiceName`
        - es. `components.cuisine.CuisineFactory`
        - es. `components.cuisine.CuisineDirective`
- Css class\id names: `soma-class-name some-id-name`


### Syntax

```
if () {
}

for (var i = 0; i < 2; i++) {
}

function funcName () {
}

var obj = {
	prop: {
    },
    method: function () {
    } 
}

```

### e2e / protractor

- We can use protractor global variables: browser, element, by and protractor
- To change url use the page method go()
- Use the protractor control flow http://angular.github.io/protractor/#/control-flow
- I suggest using node 0.10.30 and protractor 1.6.1 so that you can take advantage of the REPL in the browser.pause() method to debug
- Use $ as an alias for element(by.css 



## Environments

There are 3 environments:

- **dev** locally (with vagrant)
- **test** target the test api (create all your fake data here)
- **prod** target the real api (only real users and data)

## Useful commands

- Run the app on browser with test env `grunt serve --env=test`. 
  - Perfect for quick css and js development without configuring vagrant.
  - the '-l' option enables the livereload feature (reloads the browser as you change sources: http://livereload.com/)
- Build the app for ios `grunt build --env=prod`
- Jshint `grunt jshint`


## Install

### Install requirements

1. Install Node.js and npm
2. Install ionic and cordova `npm install -g ionic cordova`
3. Follow the iOS and Android guides to install required dependencies
    - https://cordova.apache.org/docs/en/edge/guide_platforms_android_index.md.html
    - https://cordova.apache.org/docs/en/edge/guide_platforms_ios_index.md.html
4. Install bower `npm install -g bower`
5. Install grunt `npm install -g grunt grunt-cli`
6. Install ios sim `npm install -g ios-sim`
7. Install sass `gem install sass`

## Install the project

1. Clone the repo `git clone git@bitbucket.org:jacopoG/tastd-client.git`
2. `cd tastd-client`
3. `npm install`
4. `grunt install`
5. Configure the project
  1. `cp app/config/parameters.dev.json.dist app/config/parameters.dev.json`
  2. `vim app/config/parameters.dev.json`
6. Run the project `grunt serve --env=test`    

## Changelog

### 1.8.0 - New review

- New review and tags
- New tag people
- New cost

### 1.7.3 - New Registration

- New log in and sign up 

### 1.7.2 - New on boarding

- New on boarding

### 1.7.1 - GeoAddress Modal

- New GeoAddress Modal with map

### 1.7.0 - Bottom menu

- New Bottom Menu and navigation
- New Header
- New Filter and Flag Parameters
- Geo Guru modal
- Filter Modal
- New wishedBy and reviewedBy Filters

### 1.6.2 - Minor Fix

- Improve search restaurant

### 1.6.1 - Flash messages

- Flash messages
- New quick add with plus sign
- Language config
- Find gurus with 3 tabs
- Login style

### 1.6.0 - New restaurant detail and languages

- Main refactoring
- New price manager
- New restaurant detail
- Remove nested state for home
- Italian language

### 1.5.1 - Performance improvement

- Edit restaurant for editor
- Quick add without animation
- Tracking refactoring

### 1.5.0 - Notification & Android

- iOS Push Notification
- Notification option
- Remove old tutorial
- First release for android
- Price range
- New invite page
- Kochava

### 1.4.0 - Quick Add

- New homepage with footer bar
- Quick add to wish list and to favourites
- Flag ordered by cuisine
- Parent view refactoring
- Clean wall and restaurant rest call to use cache
- Fix Facebook Auth
- Remote options persistence
- Spotlight partial refactoring
- Deep folder and structure refactoring
- New gurus filter
- New profile with personal wall
- Restaurant around you
- Manage unavailable geolocation
- User signature directive

### 1.3.1

- Fix registration ip fingerprint
- Allow timeout cancel

### 1.3.0 - Quick Follow, Gallery and Wall

- New data for analytics
- Photo and Gallery for restaurants
- New tag system
- On boarding step 3 (invite by email)
- New score badge and GeoScore 
- New restaurant detail
- Quick Follow unfollow
- Wall
- Search guru with city filter
- Info before invite

#### 1.2.0 - Tutorial

- New Back button
- New intro comics
- New Interactive tutorial
- Native iOS sharing for restaurant detail, ranking and invite
- Local storage improvement
- Handle lost connection
- New tag and comment style

#### 1.1.0 - On Boarding

- Deep components refactoring
- New on boarding with quick add gurus and quick add restaurants
- Address popup allows just street name without street number
- Dynamic filters
- Markers border
- New ranking style
- Change restaurant cuisine
- User city is required


#### 1.0.0 

- mapList as default view
- animation ranking list
- fix not refreshing list
- orderBy=position for following reviews
- Right link for privacy and terms
- send fingerprint on signup
- handle failed geolocation
- remove double arrow back
- added popup to notice user no contents
- New following ranking navigation
- Popup as a service 
- bring the user back to the cities if he deletes the last review

#### 0.9.1

- New ranking navigation
- User geoname
- Credential and facebook auth improved with permissions
- Birth Year
- use flags to ignore redirection to map on resume
- Save ranking popup
- No guru or no restaurant popup
- Order marker by lat
- Reorder ranking fix
- More glow to active filter
- Minor fixes and improvements

#### 0.9.0

- Show tags in resto detail
- Send to map when resuming from background
- Fake back button after insert
- Select all gurus
- shorter history for google places insert
- arrow added in people button
- User search order by score
- Quick invite with email
- Simple currency conversion
- New follow button
- Minor fixes and changes

#### 0.8.2

- Wish as a filter in filter-map-service
- Launch images iPad
- Fix avatar
- Analytics
- Change icons
- Same loader everywhere
- Fix tutorial Style
- Fixes login when the refresh token is still valid

#### 0.8.1

- Main style improvement
- Hide wishlist buttons for other gurus
- Default geoname improvement
- Minor fixes

#### 0.8.0

- First release
