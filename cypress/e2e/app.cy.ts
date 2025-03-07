/// <reference types="cypress" />

describe('Simulation Demo UI Tests', () => {
  // Before each test, visit the base URL.
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the demo with canvas and overlay controls visible', () => {
    // Check that the Three.js canvas exists.
    cy.get('canvas').should('be.visible');
    // Check that the overlay elements exist.
    cy.get('#start').should('exist');
    cy.get('#pause').should('exist');
    cy.get('#timeDisplay').should('exist');
  });

  it('should update global time when simulation is started', () => {
    // Click on the start button.
    cy.get('#start').click();
    // Wait briefly and verify that global time is updated.
    cy.wait(200);
    cy.get('#timeDisplay').then($display => {
      const text = $display.text();
      const time = parseFloat(text.replace('Time: ', '').replace(' s', ''));
      expect(time).to.be.greaterThan(0);
    });
  });

  it('should reset the simulation when the Reset control is used', () => {
    // Use the GUI controls to click on the Reset button.
    // As lil-gui renders DOM elements, find the Reset button by text:
    cy.contains('Reset Simulation').click();
    // Wait for the simulation to reset.
    cy.wait(100);
    // Check that global time is reset to 0.
    cy.get('#timeDisplay').should('contain', 'Time: 0.00 s');
  });

  it('should randomize sensor positions when Randomize is clicked', () => {
    // Capture initial sensor positions via window object.
    cy.window().then((win: any) => {
      const initialPositions = win.engine.sensors.map((s: any) =>
        s.position.toArray()
      );
      cy.contains('Randomize Sensors').click();
      cy.wait(100);
      const newPositions = win.engine.sensors.map((s: any) =>
        s.position.toArray()
      );
      expect(newPositions).to.not.deep.equal(initialPositions);
    });
  });

  it('should toggle time reversal and display reversing behavior', () => {
    cy.window().then((win: any) => {
      const initialTime = win.engine.globalTime;
      win.engine.start();
      win.engine.update();
      const timeAfterForward = win.engine.globalTime;
      expect(timeAfterForward).to.be.greaterThan(initialTime);
      cy.contains('Toggle Time Reversal').click();
      win.engine.update();
      // With time reversal, global time should decrease.
      expect(win.engine.globalTime).to.be.lessThan(timeAfterForward);
      win.engine.pause();
    });
  });

  it('should apply impulse when container is clicked', () => {
    // Click on the container element (assume it's the first sensor sphere mesh rendered).
    cy.get('canvas').click(300, 300); // Adjust coordinates based on your container position.
    // Access the window object to check changes in container sphere velocity.
    cy.window().then((win: any) => {
      // Assuming the container is the first sensor sphere.
      const containerVelocity = win.engine.sensorSpheres[0].velocity;
      expect(containerVelocity.y).to.be.greaterThan(0);
    });
  });
});
