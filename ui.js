const sliders = document.querySelectorAll(".slider");

function valueToPercent(value, min, max) {
    return ((value - min) / (max - min)) * 100;
}

function percentToValue(percent, min, max) {
    return (percent * (max - min)) / 100 + min;
}

class Slider {
    constructor({id, value, min, max, track_color}) {
        this.id = id;
        this.value = value;
        this.min = min;
        this.max = max;
        this.track_color = track_color;

        this.setup();
    }

    _addEventListeners() {
        this.track.addEventListener("pointerdown", (e) => this._pointerDown(e));

        this.knob.addEventListener("pointerdown", (e) => this._pointerDown(e));
        document.addEventListener("pointerup", (e) => this._pointerUp(e));
    }

    _setValue(percent) {
        this.state.value = percentToValue(percent, this.min, this.max);

        // Put the knob in the right position.
        this.knob.style.left = `${percent}%`;

        // Put the gradient to the appropriate place
        this.track.style.backgroundPosition = `${100 - percent}% 0%`;
    }
    
    _pointerDown(e) {
        if (e.target == this.track) {
            this.state.pointerDown = false;

            const mousePosX = e.clientX;
            const positionPercentage = clamp(((mousePosX - this.track_offset.left) / (this.track_offset.right - this.track_offset.left)) * 100, 0, 100);
            this._setValue(positionPercentage);
        } else {
            this.state.pointerDown = true;
            // Switch pointer to grabbing
            this.knob.style.cursor = "grabbing";

            this.pointerMoveHandler = (e) => this._pointerMove(e);
            document.addEventListener("pointermove", this.pointerMoveHandler);
        }

    }
        
    _pointerUp(e) {
        this.state.pointerDown = false;
        // Switch pointer to non-grabbing
        this.knob.style.cursor = "grab";

        // Set the hidden field's value when we let go
        this.hidden.value = this.state.value;

        // Trigger event
        const event = new Event("change", {
            bubbles: true,
            cancelable: true
        });
        this.hidden.dispatchEvent(event);

        document.removeEventListener("pointermove", this.pointerMoveHandler);
    }

    _pointerMove(e) {
        if (!this.state.pointerDown) return;
        const mousePosX = e.clientX;
        const positionPercentage = clamp(((mousePosX - this.track_offset.left) / (this.track_offset.right - this.track_offset.left)) * 100, 0, 100);

        this._setValue(positionPercentage);
    }

    setup() {
        this.state = {
            pointerDown: false,
            value: this.value,
        }

        // Save important elements
        this.el = document.getElementById(this.id);
        this.track = this.el.querySelector(".slider-track");
        this.knob = this.el.querySelector(".slider-knob");
        this.hidden = this.el.querySelector("input");

        if (this.value < this.max && this.value > this.min) {
            this._setValue(valueToPercent(this.value, this.min, this.max));
        }

        // Save track offsets
        this.track_offset = {
            left: this.track.getBoundingClientRect().left,
            right: this.track.getBoundingClientRect().right
        };

        // Set the color
        this.track.style.backgroundImage = `linear-gradient(90deg, ${this.track_color} 50%, #282828 50%)`

        this._addEventListeners();
    }
}