const ROAD_MAP = '/static/frontend/sprites/map/road_map.png',
      TUTORIAL_ROAD_MAP = '/static/frontend/sprites/tutorial/map_road.png',
      ZOOM_FACTOR = 25;

export default class RoadMap {
    constructor() {
        this._map_image_data = {true: null, false: null};
        for (const is_tutorial of [true, false]) {
            const road_map = is_tutorial ? TUTORIAL_ROAD_MAP : ROAD_MAP;
            const map_image = $('<img>').attr('src', road_map).get(0);
            map_image.onload = () => {
                const canvas = $('<canvas>').attr('width', map_image.width).attr('height', map_image.height).get(0);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(map_image, 0, 0);
                this._map_image_data[is_tutorial] = ctx.getImageData(0, 0, map_image.width, map_image.height);
            }
        }
    }

    is_empty(is_tutorial, x, y) {
        return true;
        /* TODO:
        const map_image_data = this._map_image_data[is_tutorial];

        y += 70;
        x += 32;

        if (map_image_data) {
            return !map_image_data.data[(Math.floor(y / ZOOM_FACTOR) * map_image_data.width + Math.floor(x / ZOOM_FACTOR)) * 4];
        }
        return false;
        */
    }
}