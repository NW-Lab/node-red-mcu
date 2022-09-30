/*
 * Copyright (c) 2022  Moddable Tech, Inc.
 *
 *   This file is part of the Moddable SDK Runtime.
 *
 *   The Moddable SDK Runtime is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   The Moddable SDK Runtime is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Lesser General Public License for more details.
 *
 *   You should have received a copy of the GNU Lesser General Public License
 *   along with the Moddable SDK Runtime.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {Node} from "nodered";
import Modules from "modules";

class Sensor extends Node {
	#io;
	#sensor;
	#configuration;

	onStart(config) {
		super.onStart(config);

		this.#io = config.io;
		const configuration = config.configuration ? JSON.parse(config.configuration) : undefined;

		try {
			const Sensor = Modules.importNow(config.module);
			let sensor;
			const bus = config.bus ?? "default";
			if ("SMBus" === this.#io) 
				sensor = {...device.I2C[bus], io: device.io.SMBus}
			else
				sensor = device[this.#io][bus];
			this.#sensor = new Sensor({sensor});
			if (configuration)
				this.#sensor.configure(configuration);
		}
		catch {
		}
	}
	onMessage(msg) {
		msg.payload = this.#sensor?.sample();
		return msg;
	}

	static type = "sensor";
	static {
		RED.nodes.registerType(this.type, this);
	}
}
