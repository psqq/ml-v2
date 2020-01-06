import BaseGame from '../classes/base-game';
import Victor from 'victor';
import Entity from '../classes/entity';
import Stats from '../classes/stats';
import GameEntity from './game-entity';


export default class MinionEntity extends GameEntity {
    /**
     * @param {Object} o - options
     * @param {BaseGame} o.game
     * @param {number} [o.zindex=0] - zindex for draw
     * @param {Victor} [o.position=(0, 0)] - center of entity
     * @param {Victor} [o.size=(0, 0)] - width and height of entity
     * @param {sring} [o.side=blue] - width and height of entity
     */
    constructor(o = {}) {
        _.defaults(o, {
            size: new Victor(12, 16),
            side: 'blue',
            attackRange: 50,
            maxHp: 300,
            maxMp: 0,
            attackDamge: 30,
            waypoints: [],
        });
        super(o);
        this.createBody();
        if (this.side === 'blue')
            this.image = this.game.imageManager.getImage('BlueMinion');
        else
            this.image = this.game.imageManager.getImage('RedMinion');
        /** @type {Victor[]} */
        this.waypoints = o.waypoints;
        this.currentWaypoint = 0;
    }
    createBody() {
        this.body = this.game.physicsEngine.addBody({
            isArcade: true,
            shape: 'rectangle',
            position: this.position,
            size: this.size,
        });
    }
    getCurrentWaypoint() {
        const wp = this.waypoints[this.currentWaypoint];
        if (wp.distance(this.position) < 25) {
            this.currentWaypoint += 1;
        }
        this.currentWaypoint = Math.min(this.currentWaypoint, this.waypoints.length - 1);
        return this.waypoints[this.currentWaypoint];
    }
    update() {
        super.update();
        const enemy = this.searchForNearestEnemy();
        const waypoint = this.getCurrentWaypoint();
        if (!enemy) {
            this.game.physicsEngine.setVelocityForBody(this.body, new Victor(0, 0));
            return;
        }
        if (this.isInRange(enemy)) {
            this.game.physicsEngine.setVelocityForBody(this.body, new Victor(0, 0));
            this.attack(enemy);
        } else {
            this.gotoPosition(waypoint);
        }
    }
    draw() {
        this.game.canvas.drawImage(this.image, this.position);
    }
}
