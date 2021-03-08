/**
 * Модуль для автоматической инициализации Vue компонентов на странице сайта
 *
 * Метод `init(Vue, components)` Загружает компоненты в соответствующие элементы на странице
 * и передает в них изначальные данные
 *
 * Например, вместо блока:
 *
 * <div class="vue-component" data-component="DemoApp" data-initial='{"test": "data"}'></div>
 *
 * Будет подключен компонент DemoApp (если тот присутствует в объекте-коллекции `components`)
 *
 * и в его свойство initial будет передан JSON-объект {"test": "data"}
 *
 * Передача в метод экземпляра `Vue` позволяет предварительно его сконфигурировать:
 * например, добавить Vuex-store и/или разнообразные плагины и миксины.
 */

import logger from './logger';


export default {
  init(Vue, components, options) {
    this.options = Object.assign(this.options, options);

    const nodes = Array.from(document.querySelectorAll(this.options.selector));


    const collection = [];

    nodes.forEach((item) => {
      const initialData = {};

      for (let i = 0; i < Object.keys(item.dataset).length; i += 1) {
        const key = Object.keys(item.dataset)[i];
        try {
          initialData[key] = JSON.parse(item.dataset[key]);
        } catch (e) {
          initialData[key] = item.dataset[key];
          logger.warn(e);
        }
      }


      if (components[item.dataset[this.options.componentDataAttr]] !== undefined) {
        collection.push(this.createComponentInstance(
          Vue,
          item,
          components[item.dataset[this.options.componentDataAttr]],
          { ...initialData },
        ));
      }
    });

    return collection;
  },

  options: {
    selector: '.vue-component',
    componentDataAttr: 'component',
    initialDataAttr: 'initial',
  },


  createComponentInstance(Vue, element, component, data) {
    return new Vue({
      el: element,
      render(h) {
        return h(component, {
          props: data,
        });
      },
    });
  },

};
