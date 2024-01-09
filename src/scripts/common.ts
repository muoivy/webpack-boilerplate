import 'babel-polyfill'

Array.prototype.forEach.call(
  document.querySelectorAll('[data-module]'),
  (element: HTMLElement) => {
    const keys: string[] = element.getAttribute('data-module')!.split(/\s+/)
    const opts: string | null = element.getAttribute('data-options') || null

    keys.forEach(key => {
      if (!key) return false
      const options: object = opts
        ? keys.length > 1
          ? JSON.parse(opts)[key]
          : JSON.parse(opts)
        : {}
      try {
        const Module = require(`./modules/${key.charAt(0).toUpperCase() + key.slice(1)}`).default
        if (Module !== void 0) {
          return new Module(element, options)
        }
      } catch (e) {
        // console.log(e.message);
      }
    })
  }
)

import * as Dummy from './modules/Dummy';
Dummy.Hello();
