export default class Vector {
    constructor(x, y) {
        // Copy c'tor
        if (typeof y === 'undefined') {
            y = x.y;
            x = x.x;
        }

        this.x = x;
        this.y = y;
    }

    calcAngleDegrees() {
        return Math.atan2(this.y, this.x) * 180 / Math.PI;
    }

    mul(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    imul(factor) {
        this.x *= factor;
        this.y *= factor;
    }

    iadd(other) {
        this.x += other.x;
        this.y += other.y;
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    zero() {
        this.x = 0;
        this.y = 0;
    }

    get length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
};

