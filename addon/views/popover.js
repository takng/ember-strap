import Ember from 'ember';

export default Ember.View.extend({
  actions: {
    hidePopover: function() {
      $('[data-ember-strap-popover=' + this.get('popoverId') + ']').popover('hide');
    }
  }
});
