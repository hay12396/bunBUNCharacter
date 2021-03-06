var AliveClass = (function () {
    function AliveClass() {
        this.lastTick = 0;
    }
    AliveClass.prototype.onStart = function (handler, disabledPermissions) {
        this.handler = handler;
        this.handler.getActionManager().move(0, this.handler.getConfigurationManager().getScreenHeight(), 0);
        this.initializeStates(handler);
    };
    AliveClass.prototype.onTick = function (time) {
        this.states.getValue(this.currentState).onTick(time);
    };
    AliveClass.prototype.onBackgroundTick = function (time) {
        this.states.getValue(this.currentState).onBackgroundTick(time);
    };
    AliveClass.prototype.initializeStates = function (handler) {
        this.states = new collections.Dictionary();
        var sleepingState = new SleepingState(this);
        var passiveState = new PassiveState(this);
        var crazyState = new CrazyState(this);
        sleepingState.onStart(handler);
        passiveState.onStart(handler);
        crazyState.onStart(handler);
        this.states.setValue(bunBUNState.SLEEPING, sleepingState);
        this.states.setValue(bunBUNState.PASSIVE, passiveState);
        this.states.setValue(bunBUNState.CRAZY, crazyState);
        var now = handler.getConfigurationManager().getCurrentTime();
        this.currentState = bunBUNState.PASSIVE;
    };
    AliveClass.prototype.onPhoneEventOccurred = function (eventName, jsonedData) {
        this.states.getValue(this.currentState).onPhoneEventOccurred(eventName);
    };
    AliveClass.prototype.onRelease = function (currentX, currentY) {
        this.states.getValue(this.currentState).onRelease(currentX, currentY);
    };
    AliveClass.prototype.onPick = function (currentX, currentY) {
        this.states.getValue(this.currentState).onPick(currentX, currentY);
    };
    AliveClass.prototype.onMenuItemSelected = function (viewName) {
        this.states.getValue(this.currentState).onMenuItemSelected(viewName);
    };
    AliveClass.prototype.onResponseReceived = function (response) {
        this.states.getValue(this.currentState).onResponseReceived(response);
    };
    AliveClass.prototype.onLocationReceived = function (location) {
        this.states.getValue(this.currentState).onLocationReceived(location);
    };
    AliveClass.prototype.onUserActivityStateReceived = function (state) {
        this.states.getValue(this.currentState).onUserActivityStateReceived(state);
    };
    AliveClass.prototype.onHeadphoneStateReceived = function (state) {
        this.states.getValue(this.currentState).onHeadphoneStateReceived(state);
    };
    AliveClass.prototype.onWeatherReceived = function (weather) {
        this.states.getValue(this.currentState).onWeatherReceived(weather);
    };
    AliveClass.prototype.onSpeechRecognitionResults = function (results) {
        this.states.getValue(this.currentState).onSpeechRecognitionResults(results);
    };
    AliveClass.prototype.onConfigureMenuItems = function (menuBuilder) {
        var menuHeader = new MenuHeader();
        menuHeader.TextColor = "#db859e";
        menuHeader.BackgroundColor = "#576368";
        var picture = new PictureMenuItem();
        picture.InitialX = 0;
        picture.InitialY = 0;
        picture.Height = 2;
        picture.Width = menuBuilder.getMaxColumns();
        picture.Name = "picture";
        picture.PictureResourceName = "cute_cover.png";
        var moodLabel = new TextBoxMenuItem();
        moodLabel.BackgroundColor = "#7e8f96";
        moodLabel.TextColor = "#db859e";
        moodLabel.InitialX = 0;
        moodLabel.InitialY = 2;
        moodLabel.Width = 1;
        moodLabel.Height = 1;
        moodLabel.Name = "moodLabel";
        moodLabel.Text = "Crazy:";
        var mood = new ProgressBarMenuItem();
        mood.InitialX = 1;
        mood.InitialY = 2;
        mood.Width = 3;
        mood.Height = 1;
        mood.MaxProgress = 100;
        mood.Name = "moodProgress";
        mood.Progress = 0;
        mood.TextColor = "#ffffff";
        mood.BackgroundColor = "#7e8f96";
        mood.FrontColor = "#b30000";
        var hungerLabel = new TextBoxMenuItem();
        hungerLabel.BackgroundColor = "#7e8f96";
        hungerLabel.TextColor = "#db859e";
        hungerLabel.InitialX = 0;
        hungerLabel.InitialY = 3;
        hungerLabel.Width = 1;
        hungerLabel.Height = 1;
        hungerLabel.Name = "hungerLabel";
        hungerLabel.Text = "Hunger:";
        var hunger = new ProgressBarMenuItem();
        hunger.InitialX = 1;
        hunger.InitialY = 3;
        hunger.Width = 3;
        hunger.Height = 1;
        hunger.MaxProgress = 100;
        hunger.Name = "hungerProgress";
        hunger.Progress = 0;
        hunger.TextColor = "#ffffff";
        hunger.BackgroundColor = "#7e8f96";
        hunger.FrontColor = "#ff0000";
        var feedButton = new ButtonMenuItem();
        feedButton.InitialX = 0;
        feedButton.InitialY = 4;
        feedButton.Height = 1;
        feedButton.Width = 1;
        feedButton.Text = "Feed";
        feedButton.TextColor = "#db859e";
        feedButton.BackgroundColor = "#7e8f96";
        feedButton.Name = "feedButton";
        var feedCount = new TextBoxMenuItem();
        feedCount.InitialX = 1;
        feedCount.InitialY = 4;
        feedCount.Height = 1;
        feedCount.Width = 3;
        feedCount.Text = "5 Carrots left";
        feedCount.Name = "foodCount";
        feedCount.TextColor = "#db859e";
        feedCount.BackgroundColor = "#7e8f96";
        var playButton = new ButtonMenuItem();
        playButton.InitialX = 0;
        playButton.InitialY = 5;
        playButton.Height = 1;
        playButton.Width = menuBuilder.getMaxColumns();
        playButton.Text = "Let's play!";
        playButton.TextColor = "#db859e";
        playButton.BackgroundColor = "#7e8f96";
        playButton.Name = "playButton";
        menuBuilder.createMenuHeader(menuHeader);
        menuBuilder.createPicture(picture);
        menuBuilder.createTextBox(moodLabel);
        menuBuilder.createProgressBar(mood);
        menuBuilder.createTextBox(hungerLabel);
        menuBuilder.createProgressBar(hunger);
        menuBuilder.createButton(feedButton);
        menuBuilder.createTextBox(feedCount);
        menuBuilder.createButton(playButton);
    };
    AliveClass.prototype.onPlacesReceived = function (places) {
        this.handler.getActionManager().showMessage(JSON.stringify(places), "#000000", "#eeeeee", 10000);
    };
    AliveClass.prototype.switchTo = function (state) {
        if (this.states.containsKey(state)) {
            this.currentState = state;
            this.states.getValue(state).initializeState();
        }
    };
    AliveClass.prototype.onUserEventOccurred = function (eventName, jsonedData) {
        this.states.getValue(this.currentState).onUserEventOccurred(eventName, jsonedData);
    };
    return AliveClass;
}());
//# sourceMappingURL=app.js.map