<template>
  <div class="sc-message--text" :style="messageColors">
    <template>
      <div class="sc-message--toolbox" :style="{ background: messageColors.backgroundColor }">
        <button v-if="showEdition && me && message.id" :disabled="isEditing" @click="edit">
          <IconBase :color="isEditing ? 'black' : messageColors.color" width="10" icon-name="edit">
            <IconEdit />
          </IconBase>
        </button>
        <button v-if="showDeletion && me && message.id" @click="$emit('remove')">
          <IconBase :color="messageColors.color" width="10" icon-name="remove">
            <IconCross />
          </IconBase>
        </button>
        <slot name="text-message-toolbox" :message="message" :me="me"> </slot>
      </div>
    </template>
    <slot :message="message" :messageText="messageText" :messageColors="messageColors" :me="me">
      <p class="sc-message--text-content" v-html="messageText"></p>
      <p v-if="message.data.meta" class="sc-message--meta" :style="{ color: messageColors.color }">
        {{ message.data.meta }}
      </p>
      <p v-if="message.isEdited" class="sc-message--edited">
        <IconBase width="10" icon-name="edited">
          <IconEdit />
        </IconBase>
        edited
      </p>
    </slot>
  </div>
</template>

<script>
import { mapState } from '../store/test.js'
import IconBase from './../components/IconBase.vue'
import IconEdit from './../components/icons/IconEdit.vue'
import IconCross from './../components/icons/IconCross.vue'
import { htmlEscape, htmlUnescape } from 'escape-goat'
import Autolinker from 'autolinker'
import store from '../store/test.js'
const fmt = require('msgdown')

export default {
  components: {
    IconBase,
    IconCross,
    IconEdit
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    messageText () {
      const escaped = htmlEscape(this.message.data.text)

      return Autolinker.link(this.messageStyling ? fmt(escaped) : escaped, {
        className: 'chatLink',
        truncate: { length: 50, location: 'smart' }
      })
    },
    me () {
      return this.message.author === 'me'
    },
    isEditing () {
      return (store.state.editMessage && store.state.editMessage.id) === this.message.id
    },
    ...mapState(['showDeletion', 'showEdition'])
  },
  methods: {
    edit () {
      store.setState('editMessage', this.message)
    }
  }
}
</script>

<style scoped lang="scss">
.sc-message--text {
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 300;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  -webkit-font-smoothing: subpixel-antialiased;

  .sc-message--text-content {
    white-space: pre-wrap;
    margin: 0;
  }

  &:hover .sc-message--toolbox {
    left: -20px;
    opacity: 1;
  }

  .sc-message--toolbox {
    transition: left 0.2s ease-out 0s;
    white-space: normal;
    opacity: 0;
    position: absolute;
    left: 0px;
    width: 25px;
    top: 0;

    button {
      background: none;
      border: none;
      padding: 0px;
      margin: 0px;
      outline: none;
      width: 100%;
      text-align: center;
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }

    & ::v-deep svg {
      margin-left: 5px;
    }
  }

  code {
    font-family: 'Courier New', Courier, monospace !important;
  }
}

.sc-message--content.sent .sc-message--text {
  color: white;
  background-color: #4e8cff;
  max-width: calc(100% - 120px);
  word-wrap: break-word;
  border-bottom-right-radius: 0px;
}

.sc-message--content.received .sc-message--text {
  color: #263238;
  background-color: #f4f7f9;
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}

a.chatLink {
  color: inherit !important;
}
</style>
