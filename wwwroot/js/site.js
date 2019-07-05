import { MapToGlobe, Planet, Moon, Rings, Atmosphere, Light } from "./core.js";

// Google Analytics event recording
function ga_event(category, action) {
    gtag('event', action, { 'event_category': category });
}

const store = new Vuex.Store({
    state: {
        planetObject: null,
        surfaceImage: null,
        moonObject: null,
        moonPivot: null,
        ringsObject: null,
        backgroundImage: null,
        atmosphereObject: null,
        atmosphereEnabled: false,
        lightObject: null,
        lightAnchor: null,
        lightAmbient: null,
        axisEnabled: false,
        publicLink: "",
        privateLink: ""
    },
    mutations: {
        resize: function () { MapToGlobe.WindowResize(); },
        setSurfaceFile: function (state, file) {
            state.surfaceImage = file;
        },
        surfaceFileSelect: function(state, file) {
            Planet.SetSurface(file, state.planetObject);
            state.surfaceImage = file;
            ga_event('Planet', 'Surface File Select');
        },
        heightmapFileSelect: function (state, file) {
            Planet.SetHeightMap(file, state.planetObject);
            ga_event('Planet', 'Heightmap File Select');
        },
        nightmapFileSelect: function (state, file) {
            Planet.SetNightMap(file, state.planetObject);
            ga_event('Planet', 'Nightmap File Select');
        },
        specularFileSelect: function (state, file) {
            Planet.SetSpecular(file, state.planetObject);
            ga_event('Planet', 'Specular File Select');
        },
        addMoon: function (state) {
            if (!state.moonObject) {
                const moon = new Moon();
                state.moonObject = moon.moon;
                state.moonPivot = moon.Object;
            }
            ga_event('Moon', 'Add Moon');
        },
        removeMoon: function (state) {
            MapToGlobe.DetachControls();
            Moon.Remove(state.moonPivot);
            state.moonObject = null;
            ga_event('Moon', 'Remove Moon');
        },
        moonSurface: function (state, file) {
            Moon.SetSurface(file, state.moonObject);
            ga_event('Moon', 'Moon Surface File Select');
        },
        moonObject: function (state, object) {
            state.moonObject = object;
        },
        moonPivot: function (state, object) {
            state.moonPivot = object;
        },
        addRings: function (state) {
            const rings = new Rings();
            state.ringsObject = rings;
            ga_event('Rings', 'Add Rings');
        },
        removeRings: function (state) {
            MapToGlobe.DetachControls();
            Rings.Remove(state.ringsObject);
            state.ringsObject = null;
            ga_event('Rings', 'Remove Rings');
        },
        setRingsTexture: function (state, file) {
            Rings.SetTexture(file, state.ringsObject);
            ga_event('Rings', 'Rings Texture Select');
        },
        ringsObject: function (state, object) {
            state.ringsObject = object;
        },
        backgroundImage: function (state, file) {
            state.backgroundImage = file;
        },
        planetObject: function (state, object) {
            state.planetObject = object;
        },
        atmosphereObject: function (state, object) {
            state.atmosphereObject = object;
        },
        addAtmosphere: function (state) {
            state.atmosphereObject = new Atmosphere(state.planetObject, state.lightObject);
            state.atmosphereEnabled = true;
            ga_event('Atmosphere', 'Enable Atmosphere');
        },
        removeAtmosphere: function (state) {
            Atmosphere.Remove(state.atmosphereObject, state.planetObject);
            state.atmosphereObject = null;
            state.atmosphereEnabled = false;
            ga_event('Atmosphere', 'Disable Atmosphere');
        },
        lightObject: function (state, object) {
            state.lightObject = object;
        },
        lightAmbient: function (state, object) {
            state.lightAmbient = object;
        },
        lightAnchor: function (state, object) {
            state.lightAnchor = object;
        },
        setPublicLink: function (state, link) {
            state.publicLink = link;
        },
        setPrivateLink: function (state, link) {
            state.privateLink = link;
        }
    },
    getters: {
        getStateValue: (state) => (stateObject) => {
            return (state[stateObject] === null || state[stateObject] === false) ? true : false;
        }
    },
});

Vue.component("VueSlider", {
    props: ["item"],
    template: `<div class="slider-container"><p>{{ item.text }}</p><vue-slider v-model="item.start" :min="item.min" :max="item.max" :interval="item.step" v-on:change="change($event, item)"></vue-slider></div>`,
    components: {
        "vue-slider": window["vue-slider-component"]
    },
    methods: {
        change: function (value, item) {
            switch (item.id) {
                case "darkness":
                case "rayleigh":
                case "mie":
                    Atmosphere.Update(this.$store.state.atmosphereObject, this.$store.state.planetObject, item.id, value);
                    break;
                case "ringsRadius":
                    Rings.SetRadius(value, this.$store.state.ringsObject);
                    break;
                case "sunIntensity":
                    Light.SetIntensity(value, this.$store.state.lightObject);
                    break;
                case "ambientIntensity":
                    Light.SetIntensity(value, this.$store.state.lightAmbient);
                    break;
                case "moonDistance":
                    Moon.SetDistance(value, this.$store.state.moonObject);
                    break;
            }
        }
    }
});

const checkboxComponent = {
    props: ["item"],
    template: `<div><input type="checkbox" v-bind:checked="checkedState" v-bind:disabled="disabledState" v-bind:id="item.id" v-bind:name="item.id" v-on:change="checkboxChange($event,item)"><label v-bind:for="item.id">{{ item.text }}</label></div>`,
    methods: {
        checkboxChange: function (event, item) {
            switch (item.id) {
                case "toggleAxis":
                    Planet.ToggleAxis(this.$store.state.planetObject);
                    break;
                case "toggleAtmosphere":
                    if (!this.$store.state.atmosphereObject) {
                        this.$store.commit("addAtmosphere");
                    }
                    else {
                        this.$store.commit("removeAtmosphere");
                    }
                    break;
                case "planetControls":
                case "ringsControls":
                case "lightingControls":
                    if (event.target.checked) {
                        let object;

                        switch (item.parent) {
                            case "planet":
                                object = store.state.planetObject;
                                break;
                            case "rings":
                                object = store.state.ringsObject;
                                break;
                            case "lighting":
                                object = store.state.lightAnchor;
                                break;
                        }

                        MapToGlobe.AttachControls(object, "rotate");
                    }
                    else {
                        MapToGlobe.DetachControls();
                    }
                    break;
            }
        }
    },
    computed: {
        checkedState: function (item) {
            let state;
            switch (item.item.id) {
                case "toggleAxis":
                    state = this.$store.state.axisEnabled;
                    break;
                case "toggleAtmosphere":
                    state = this.$store.state.atmosphereEnabled;
                    break;
                default:
                    state = false;
                    break;
            }
            return state;
        },
        disabledState: function (item) {
            if (item.item.dependsOn)
                return item.item.dependsOn && this.$store.getters.getStateValue(item.item.dependsOn);
            else
                return false;
        }
    }
};

const radioComponent = {
    props: ["item"],
    template: `<div><input type="radio" v-bind:disabled="disabledState" v-bind:id="item.id" v-bind:name="item.name" v-on:change="radioChange(item)" v-bind:checked="item.selected"><label v-bind:for="item.id">{{ item.text }}</label></div>`,
    methods: {
        radioChange: function (item) {
            switch (item.id) {
                case "bgImage":
                    MapToGlobe.SetBGImage(this.$store.state.backgroundImage);
                    break;
                case "bgBlack":
                    MapToGlobe.SetBGBlack();
                    break;
                case "bgTransparent":
                    MapToGlobe.SetBGTransparent();
                    break;
                case "bg3D":
                case "bg2D":
                    MapToGlobe.SetBG3D();
                    break;
                case "moonOrbitControls":
                case "moonRotationControls":
                case "moonScaleControls":
                    let object;

                    switch (item.controlObject) {
                        case "moon":
                            object = store.state.moonObject;
                            break;
                        case "moonOrbit":
                            object = store.state.moonPivot;
                            break;
                    }

                    MapToGlobe.AttachControls(object, item.controlType);
                    break;
            }
        }
    },
    computed: {
        disabledState: function (item) {
            if (item.item.dependsOn)
                return item.item.dependsOn && this.$store.getters.getStateValue(item.item.dependsOn);
            else
                return false;
        }
    }
};

Vue.component('popout-menu', {
    props: ["item"],
    template: `
        <div class="popout" v-bind:id="item.id">
            <h3 class="sidebar-category">{{ item.title }}</h3>
            <ul class="sidebar-items">
                <li v-for="component in item.components" v-bind:key="component">
                    <component v-bind:is="component.type" v-bind:item="component"></component>
                </li>
            </ul>
        </div>`,
    components: {
        "color": {
            props: ["item"],
            template: `<div><p>{{ item.text }}</p><chrome-picker :value="colors" v-on:input="colorChange" /></div>`,
            data: function () {
                return {
                    colors : {
                        hex: '#194d33',
                        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
                        hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
                        rgba: { r: 25, g: 77, b: 51, a: 1 },
                        a: 1
                    }
                };
            },
            methods: {
                colorChange: function (color) {
                    Atmosphere.Update(this.$store.state.atmosphereObject, this.$store.state.planetObject, "color", color.rgba);
                }
            },
            components: {
                "chrome-picker": VueColor.Chrome
            }
        },
        "checkboxComponent": checkboxComponent,
        "radioComponent": radioComponent
    }
});

Vue.component("modal", {
    template: "#modal-template",
    props: ["show"],
    methods: {
        close: function () {
            this.$emit("close");
        }
    },
    mounted: function () {
        document.addEventListener("keydown", (e) => {
            if (this.show && e.keyCode === 27) {
                this.close();
            }
        });
    }
});

Vue.component("SavedModal", {
    template: "#saved-modal-template",
    props: ["show"],
    computed: {
        publicLink: {
            get: function() {
                return this.$store.state.publicLink;
            }
        },
        privateLink: {
            get: function() {
                return this.$store.state.privateLink;
            }
        }
    },
    methods: {
        close: function () {
            this.$emit("close");
            this.$store.commit("setPublicLink", "");
            this.$store.commit("setPrivateLink", "");
        },
        copyLink: function (e) {
            e.target.select();
            document.execCommand("copy");
        }
    }
});

Vue.component("ErrorModal", {
    template: "#error-modal-template",
    props: ["show"],
    methods: {
        close: function () {
            this.$emit("close");
        }
    }
});

Vue.component("LoadingOverlay", {
    template: "#loading-overlay",
    props: ["show"]
});

Vue.component("sidebar-item", {
    props: ["item"],
    template: `
        <div class="sidebar-group">
            <h3 class="sidebar-category">{{ item.header }}</h3>
            <ul class="sidebar-items">
                <li v-for="subitem in item.items" v-bind:key="subitem">
                    <button v-on:click="subitem.submenu ? { click: menuClick($event) } : openMenuItem(subitem)" v-bind:id="subitem.id">{{ subitem.text }}</button>
                    <div class="sidebar-submenu" v-if="subitem.submenu">
                        <div v-for="submenuitem in subitem.submenu" v-bind:key="submenuitem" class="sidebar-group">
                            <h3 class="sidebar-category">{{ submenuitem.title }}</h3>
                            <ul class="sidebar-items">
                                <li v-for="submenuitem2 in submenuitem.items" v-bind:key="submenuitem2">
                                    <component v-bind:is="submenuitem2.component" v-bind:item="submenuitem2"></component>
                                    <popout-menu v-if="submenuitem2.popout" v-bind:item="submenuitem2.popout"></popout-menu>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>`,
    methods: {
        openMenuItem: function (item) {
            switch (item.event) {
                case "helpOpen":
                    window.open("/help");
                    break;
                case "examplesOpen":
                    window.open("/examples");
                    break;
                case "saveScene":
                    vm.showLoadingOverlay = true;
                    if (new URLSearchParams(window.location.search).get("key")) {
                        MapToGlobe.Update((result) => {
                            vm.showLoadingOverlay = false;
                            if (result.IsSuccess) {
                                vm.showSavedModal = true;
                                ga_event('Save', 'Update');
                            }
                            else {
                                vm.showErrorModal = true;
                            }
                        });
                    }
                    else {
                        MapToGlobe.Save((result) => {
                            vm.showLoadingOverlay = false;
                            if (result.IsSuccess) {
                                this.$store.commit("setPublicLink", window.location.origin + "/" + result.data.id);
                                this.$store.commit("setPrivateLink", window.location.origin + "/" + result.data.id + "?key=" + result.data.key);
                                vm.showSavedModal = true;
                                ga_event('Save', 'Save');
                            }
                            else {
                                vm.showErrorModal = true;
                            }
                        });
                    }
                    break;
            }
        },
        menuClick: function (event) {
            document.querySelectorAll(".popout").forEach(function (popout) {
                popout.style.display = "none";
            });
            const sibling = event.target.nextElementSibling;
            while (sibling) {
                if (sibling.matches('.sidebar-submenu')) {
                    if (sibling.classList.contains('show')) {
                        hideMenu();
                    }
                    else {
                        MapToGlobe.DetachControls();
                        if (document.querySelector(".sidebar-submenu.show"))
                            document.querySelector(".sidebar-submenu.show").classList.remove("show");
                        showMenu();
                    }
                    return;
                }
            }

            function showMenu() {
                sibling.style.display = 'block';
                const height = sibling.scrollHeight + 'px';
                sibling.style.display = '';
                sibling.classList.add('show');
                sibling.style.height = height;
                setTimeout(() => {
                    sibling.style.height = '';
                }, 250);
            }

            function hideMenu() {
                sibling.style.height = sibling.scrollHeight + 'px';
                setTimeout(() => {
                    sibling.style.height = '0';
                }, 1);
                setTimeout(() => {
                    sibling.classList.remove('show');
                }, 250);
                MapToGlobe.DetachControls();
            }
        }
    },
    components: {
        "buttonComponent": {
            props: "item",
            template: `<button v-on:click="menuClick($event)" v-bind:id="item.id">{{ item.text }}</button>`
        },
        "linkComponent": {
            props: ["item"],
            template: `<a href="item.href">{{ item.text }}</a>`
        },
        "textComponent": {
            props: ["item"],
            template: `<button v-on:click="onClick(item)" v-bind:disabled="disabledState" v-bind:id="item.id">{{ item.text }}</button>`,
            methods: {
                onClick: function (item) {
                    if (!item.event)
                        return;

                    switch (item.event) {
                        case "addMoon":
                            this.$store.commit("addMoon");
                            break;
                        case "removeMoon":
                            this.$store.commit("removeMoon");
                            break;
                        case "addRings":
                            this.$store.commit("addRings");
                            break;
                        case "removeRings":
                            this.$store.commit("removeRings");
                            break;
                        case "togglePopout":
                            const popout = document.getElementById(item.popout.id);
                            if (popout.style.display !== "block") {
                                popout.style.display = "block";
                                popout.style.top = popout.previousElementSibling.getBoundingClientRect().top - (popout.getBoundingClientRect().height / 2) + "px";
                            }
                            else {
                                popout.style.display = "none";
                                MapToGlobe.DetachControls();
                            }
                            break;
                        case "createGif":
                            this.makeGif();
                            break;
                        case "screenshotDownload":
                            MapToGlobe.TakeScreenshot();
                            ga_event('Screenshot', 'Download Screenshot');
                            break;
                    }
                },
                makeGif: function () {
                    const direction = (document.querySelector("input[name=rotationDirection]:checked").id === "gifDirectionL2R") ? "+" + THREE.Math.degToRad(360) : "-" + THREE.Math.degToRad(360);

                    if (document.querySelector("input[name=rotatingObject]:checked").id === "gifRotatePlanet") {
                        MapToGlobe.CreateGif(this.$store.state.planetObject, direction);
                    }
                    else {
                        MapToGlobe.CreateGif(this.$store.state.lightAnchor, direction);
                    }
                    ga_event('Gif', 'Create Gif');
                }
            },
            computed: {
                disabledState: function (item) {
                    if (item.item.dependsOn)
                        return item.item.dependsOn && this.$store.getters.getStateValue(item.item.dependsOn);
                    else
                        return false;
                }
            }
        },
        "checkboxComponent": checkboxComponent,
        "radioComponent": radioComponent,
        "fileComponent": {
            props: ["item"],
            template: `<div><input type="file" v-bind:disabled="disabledState" v-on:change="fileSelect(item)" v-bind:id="item.id" v-bind:name="item.name"><label v-bind:for="item.id" class="customFileSelect">{{ item.text }}</label></div>`,
            methods: {
                fileSelect: function (item) {
                    const file = document.getElementById(item.id).files[0];
                    if (!file.type.match("image\/*")) // Stop if the uploaded file is not an image
                        return;

                    switch (item.id) {
                        case "surfaceFileSelect":
                            this.$store.commit('surfaceFileSelect', file);
                            break;
                        case "heightmapFileSelect":
                            this.$store.commit("heightmapFileSelect", file);
                            break;
                        case "nightmapFileSelect":
                            this.$store.commit("nightmapFileSelect", file);
                            break;
                        case "specularFileSelect":
                            this.$store.commit("specularFileSelect", file);
                            break;
                        case "moonSurface":
                            this.$store.commit("moonSurface", file);
                            break;
                        case "backgroundImage":
                            MapToGlobe.LoadBGImage(file, function (result) {
                                store.commit("backgroundImage", result);
                            });
                            break;
                        case "ringTexture":
                            this.$store.commit("setRingsTexture", file);
                            break;
                    }
                }
            },
            computed: {
                disabledState: function (item) {
                    if (item.item.dependsOn)
                        return item.item.dependsOn && this.$store.getters.getStateValue(item.item.dependsOn);
                    else
                        return false;
                }
            }
        }
    }
});

const vm = new Vue({
    el: "#app",
    created: function () {
        window.addEventListener("resize", function () { store.commit("resize"); });
    },
    store,
    mounted: function () {
        if (document.getElementById("loadKey").dataset.key) {
            MapToGlobe.Load(document.getElementById("loadJson").dataset.json, function (results) {
                document.getElementById("loadJson").dataset.json = "";
                results.forEach((item) => {
                    switch (item.name) {
                        case "planet":
                            store.commit("planetObject", item);
                            store.commit("setSurfaceFile", item);
                            break;
                        case "moonParent":
                            store.commit("moonPivot", item);
                            store.commit("moonObject", item.children[0]);
                            break;
                        case "rings":
                            store.commit("ringsObject", item);
                            break;
                        case "lightParent":
                            store.commit("lightAnchor", item);
                            store.commit("lightObject", item.children[0]);
                            break;
                        case "ambientLight":
                            store.commit("lightAmbient", item);
                            break;
                        case "atmosphere":
                            store.commit("atmosphereObject", item);
                            store.state.atmosphereEnabled = true;
                            break;
                    }
                });
            });
        }
        else {
            const planet = new Planet();
            store.commit("planetObject", planet);
            const light = new Light();
            store.commit("lightObject", light.light);
            store.commit("lightAnchor", light.anchor);
            store.commit("lightAmbient", light.ambientLight);
        }
    },
    data: {
        showSavedModal: false,
        showErrorModal: false,
        showLoadingOverlay: false,
        sidebaritems: [
            {
                id: 1,
                header: "Objects",
                items: [
                    {
                        text: "Planet",
                        id: "planet",
                        submenu: [
                            {
                                title: "Images",
                                items: [
                                    { text: "Surface", id: "surfaceFileSelect", component: "fileComponent" },
                                    { text: "Heightmap", id: "heightmapFileSelect", component: "fileComponent", dependsOn: "surfaceImage" },
                                    { text: "Night", id: "nightmapFileSelect", component: "fileComponent", dependsOn: "surfaceImage" },
                                    { text: "Specular", id: "specularFileSelect", component: "fileComponent", dependsOn: "surfaceImage" }
                                ]
                            },
                            {
                                title: "Axis",
                                items: [
                                    {
                                        text: "Show",
                                        id: "toggleAxis",
                                        component: "checkboxComponent"
                                    }
                                ]
                            },
                            {
                                title: "Atmosphere",
                                items: [
                                    {
                                        text: "Show",
                                        id: "toggleAtmosphere",
                                        component: "checkboxComponent",
                                        dependsOn: "surfaceImage"
                                    },
                                    {
                                        text: "Settings",
                                        component: "textComponent",
                                        dependsOn: "atmosphereEnabled",
                                        event: "togglePopout",
                                        popout: {
                                            title: "Atmosphere Settings",
                                            id: "atmosphereSettings",
                                            components: [
                                                {
                                                    text: "Night-side darkness",
                                                    type: "VueSlider",
                                                    id: "darkness",
                                                    min: 0,
                                                    max: 3,
                                                    start: 1,
                                                    step: 0.05
                                                },
                                                {
                                                    text: "Rayleigh scattering",
                                                    type: "VueSlider",
                                                    id: "rayleigh",
                                                    min: 0,
                                                    max: 0.01,
                                                    start: 0.0025,
                                                    step: 0.000001
                                                },
                                                {
                                                    text: "Mie scattering",
                                                    type: "VueSlider",
                                                    id: "mie",
                                                    min: 0,
                                                    max: 0.1,
                                                    start: 0.001,
                                                    step: 0.000001
                                                },
                                                {
                                                    text: "Color",
                                                    type: "color"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            {
                                title: "Controls",
                                items: [
                                    { text: "Show", component: "checkboxComponent", id: "planetControls", parent: "planet" }
                                ]
                            }
                        ]
                    },
                    {
                        text: "Moon",
                        id: "moon",
                        submenu: [
                            {
                                title: "Add/Remove",
                                items: [
                                    { text: "Add", id:"addMoon", component: "textComponent", event: "addMoon" },
                                    { text: "Remove", id: "removeMoon", component: "textComponent", event: "removeMoon", dependsOn: "moonObject" }
                                ]
                            },
                            {
                                title: "Images",
                                items: [
                                    { text: "Surface", component: "fileComponent", id: "moonSurface", dependsOn: "moonObject" }
                                ]
                            },
                            {
                                title: "Controls",
                                items: [
                                    {
                                        text: "Show", component: "textComponent", dependsOn: "moonObject",
                                        event: "togglePopout",
                                        popout: {
                                            title: "Controls",
                                            id: "moonControls",
                                            components: [
                                                {
                                                    text: "Distance",
                                                    type: "VueSlider",
                                                    id: "moonDistance",
                                                    min: 3,
                                                    max: 20,
                                                    start: 3,
                                                    step: 0.1
                                                },
                                                {
                                                    text: "Show Orbit Controls", type: "radioComponent", id: "moonOrbitControls", name: "moonControls", controlObject: "moonOrbit", controlType: "rotate"
                                                },
                                                {
                                                    text: "Show Moon Rotation", type: "radioComponent", id: "moonRotationControls", name: "moonControls", controlObject: "moon", controlType: "rotate"
                                                },
                                                {
                                                    text: "Show Moon Scale", type: "radioComponent", id: "moonScaleControls", name: "moonControls", controlObject: "moon", controlType: "scale"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        text: "Rings",
                        id: "rings",
                        submenu: [
                            {
                                title: "Add/Remove",
                                items: [
                                    { text: "Add", id: "addRings", component: "textComponent", event: "addRings" },
                                    { text: "Remove", id: "removeRings", component: "textComponent", event: "removeRings", dependsOn: "ringsObject" }
                                ]
                            },
                            {
                                title: "Images",
                                items: [
                                    { text: "Surface", component: "fileComponent", id: "ringTexture", dependsOn: "ringsObject" }
                                ]
                            },
                            {
                                title: "Properties",
                                items: [
                                    {
                                        text: "Properties",
                                        component: "textComponent",
                                        event: "togglePopout",
                                        dependsOn: "ringsObject",
                                        popout: {
                                            title: "Rings Properties",
                                            id: "ringsProperties",
                                            components: [
                                                {
                                                    text: "Radii",
                                                    type: "VueSlider",
                                                    id: "ringsRadius",
                                                    min: 2,
                                                    max: 10,
                                                    start: [3,5],
                                                    step: 0.1
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            {
                                title: "Controls",
                                items: [
                                    {
                                        text: "Show", component: "checkboxComponent", id: "ringsControls", parent: "rings", dependsOn: "ringsObject"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        text: "Background",
                        submenu: [
                            {
                                title: "Type",
                                items: [
                                    {
                                        text: "Solid black",
                                        id: "bgBlack",
                                        name: "bgType",
                                        component: "radioComponent",
                                        selected: true
                                    },
                                    {
                                        text: "Transparent",
                                        id: "bgTransparent",
                                        name: "bgType",
                                        component: "radioComponent"
                                    },
                                    {
                                        text: "Image",
                                        id: "bgImage",
                                        name: "bgType",
                                        component: "radioComponent",
                                        dependsOn: "backgroundImage"
                                    }
                                ]
                            },
                            {
                                title: "Images",
                                items: [
                                    { text: "Background", component: "fileComponent", id: "backgroundImage" }
                                ]
                            }
                        ]
                    },
                    {
                        text: "Lighting",
                        submenu: [
                            {
                                title: "Position",
                                items: [
                                    {
                                        text: "Show Controls", component: "checkboxComponent", id: "lightingControls", parent: "lighting"
                                    }
                                ]
                            },
                            {
                                title: "Intensities",
                                items: [
                                    {
                                        text: "Intensities",
                                        component: "textComponent",
                                        event: "togglePopout",
                                        popout: {
                                            title: "Light Intensities",
                                            id: "lightIntensities",
                                            components: [
                                                {
                                                    text: "Sun Intensity",
                                                    type: "VueSlider",
                                                    id: "sunIntensity",
                                                    min: 0,
                                                    max: 5,
                                                    start: 1,
                                                    step: 0.1
                                                },
                                                {
                                                    text: "Ambient Light Intensity",
                                                    type: "VueSlider",
                                                    id: "ambientIntensity",
                                                    min: 0,
                                                    max: 10,
                                                    start: 0,
                                                    step: 0.1
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 2,
                header: "Save",
                items: [
                    {
                        text: "Gifs",
                        submenu: [
                            {
                                title: "Rotation Direction",
                                items: [
                                    { text: "Left to Right", component: "radioComponent", name: "rotationDirection", id: "gifDirectionL2R", selected: true },
                                    { text: "Right to Left", component: "radioComponent", name: "rotationDirection", id: "gifDirectionR2L" }
                                ]
                            },
                            {
                                title: "Object to Rotate",
                                items: [
                                    { text: "Planet", component: "radioComponent", name: "rotatingObject", id: "gifRotatePlanet", selected: true },
                                    { text: "Sun", component: "radioComponent", name: "rotatingObject", id: "gifRotateSun" }
                                ]
                            },
                            {
                                title: "Create",
                                items: [
                                    { text: "Create", component: "textComponent", event: "createGif" }
                                ]
                            }
                        ]
                    },
                    {
                        text: "Screenshots",
                        submenu: [
                            {
                                title: "Take screenshot and...",
                                items: [
                                    { text: "Download", component: "textComponent", id: "screenshotDownload", event: "screenshotDownload" }
                                ]
                            }
                        ]
                    },
                    {
                        text: "Save",
                        event: "saveScene"
                    }
                ]
            },
            {
                header: "Help",
                id: 3,
                items: [
                    { text: "Examples", event: "examplesOpen" },
                    { text: "Help", event: "helpOpen" }
                ]
            }
        ]
    }
});