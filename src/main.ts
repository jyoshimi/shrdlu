import Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: Math.max(800, window.innerWidth - 450),
  height: Math.max(600, window.innerHeight),
  backgroundColor: '#000000',
  scene: [WorldScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};

const game = new Phaser.Game(config);

const conversationDiv = document.getElementById('conversation')!;
const commandInput = document.getElementById('command-input') as HTMLInputElement;
const submitButton = document.getElementById('submit-command')!;
const resetButton = document.getElementById('reset-world')!;
const helpButton = document.getElementById('show-help')!;
const helpModal = document.getElementById('help-modal')!;
const closeHelp = document.getElementById('close-help')!;

function getScene(): WorldScene | null {
  return game.scene.getScene('WorldScene') as WorldScene;
}

window.addEventListener('shrdlu-message', ((event: CustomEvent) => {
  const { type, text } = event.detail;
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;
  
  if (type === 'user') {
    messageDiv.innerHTML = `<span class="prompt">&gt;</span>${text}`;
  } else {
    messageDiv.textContent = text;
  }
  
  conversationDiv.appendChild(messageDiv);
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}) as EventListener);

function submitCommand() {
  const command = commandInput.value.trim();
  const scene = getScene();
  if (command && scene) {
    scene.executeCommand(command);
    commandInput.value = '';
  }
}

submitButton.addEventListener('click', submitCommand);

commandInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    submitCommand();
  }
});

resetButton.addEventListener('click', () => {
  const scene = getScene();
  if (scene) {
    conversationDiv.innerHTML = '';
    scene.resetWorld();
  }
});

helpButton.addEventListener('click', () => {
  helpModal.style.display = 'block';
});

closeHelp.addEventListener('click', () => {
  helpModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === helpModal) {
    helpModal.style.display = 'none';
  }
});

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth - 450, window.innerHeight);
});

commandInput.focus();
