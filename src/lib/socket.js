import { Server } from "socket.io";

/**
 * @type {import("socket.io").Server}
 */
let io;

/**
 *
 * @param {import("node:http").Server} server
 * @param {Partial<import("socket.io").ServerOptions>} opts
 * @returns {import("socket.io").Server}
 */
export const init = (server, opts) => {
  io = new Server(server, opts);
  return io;
};

/**
 *
 * @returns {import("socket.io").Server}
 */
export const getIo = () => {
  if (!io) {
    throw new Error("Can't get io instance before calling .init()");
  }
  return io;
};
