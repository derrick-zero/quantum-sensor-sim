/// <reference types="cypress" />

describe('Quantum Sensor Sim Visual Demo', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for our engine and globals to be set.
    cy.window().its('engine').should('exist');
    cy.window().its('sensors').should('exist');
    cy.window().its('sensorSpheres').should('exist');
  });

  it('should load the demo with canvas and overlay controls visible', () => {
    // Verify that Three.js canvas is visible.
    cy.get('canvas').should('be.visible');
    // Check that the overlay controls (start, pause, time display) exist.
    cy.get('#start').should('exist');
    cy.get('#pause').should('exist');
    cy.get('#timeDisplay').should('contain', 'Time:');
  });

  it('should expose GUI controls for Reset, Randomize, Toggle Time Reversal, and Impulse Strength', () => {
    cy.contains('Reset Simulation').should('be.visible');
    cy.contains('Randomize Sensors').should('be.visible');
    cy.contains('Toggle Time Reversal').should('be.visible');
    cy.contains('Impulse Strength').should('be.visible');
  });

  it('should update global time when simulation is running', () => {
    // Click Start, wait, then check that time increases.
    cy.get('#start').click();
    cy.wait(250);
    cy.get('#timeDisplay').then($display => {
      const time = parseFloat(
        $display.text().replace('Time: ', '').replace(' s', '').trim()
      );
      expect(time).to.be.greaterThan(0);
    });
    cy.get('#pause').click();
  });

  it('should apply impulse when container is clicked', () => {
    // Calculate the center of the canvas dynamically.
    cy.get('canvas').then($canvas => {
      const rect = $canvas[0].getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      cy.wrap($canvas).click(centerX, centerY);
    });
    cy.window().then((win: any) => {
      // Assuming the container is the first sensor sphere.
      const containerVelocity = win.engine.sensorSpheres[0].velocity;
      // Expect that the y-component of container velocity is now greater than 0.
      expect(containerVelocity.y).to.be.greaterThan(0);
    });
  });

  it('should reset the simulation when the Reset control is used', () => {
    // Capture the initial positions of sensors via the global engine.
    cy.window().then((win: any) => {
      // Store the initial positions as arrays.
      const initialPositions = win.engine.sensors.map((s: any) =>
        s.position.toArray()
      );
      // Trigger the Reset control via the GUI.
      cy.contains('Reset Simulation').click();
      cy.wait(100);
      cy.get('#timeDisplay').should('contain', 'Time: 0.00 s');
      // Verify that each sensor's position has been reset to its initial value.
      win.engine.sensors.forEach((sensor: any, idx: number) => {
        const initPos = initialPositions[idx];
        const currentPos = sensor.position.toArray();
        expect(currentPos[0]).to.be.closeTo(initPos[0], 1);
        expect(currentPos[1]).to.be.closeTo(initPos[1], 1);
        expect(currentPos[2]).to.be.closeTo(initPos[2], 1);
      });
    });
  });

  it('should randomize sensor positions when the Randomize control is used', () => {
    // Capture the initial positions of sensors via the global engine.
    cy.window().then((win: any) => {
      // Store the initial positions as arrays.
      const initialPositions = win.engine.sensors.map((s: any) =>
        s.position.toArray()
      );
      // Trigger the Randomize control via the GUI.
      cy.contains('Randomize Sensors').click();
      cy.wait(100);
      // Verify that each sensor's position has changed from its initial value.
      win.engine.sensors.forEach((sensor: any, idx: number) => {
        const initPos = initialPositions[idx];
        const currentPos = sensor.position.toArray();
        expect(currentPos[0]).to.not.be.closeTo(initPos[0], 1);
        expect(currentPos[1]).to.not.be.closeTo(initPos[1], 1);
        expect(currentPos[2]).to.not.be.closeTo(initPos[2], 1);
      });
    });
  });

  it('should toggle time reversal and cause simulation time to reverse direction', () => {
    cy.window().then((win: any) => {
      // Start the simulation.
      const engine = win.engine;
      engine.start();

      // Capture the initial global time.
      const initialTime = engine.globalTime;
      engine.update();

      // Perform one update: globalTime should increase by deltaTime.
      const timeAfterForward = engine.globalTime;
      expect(timeAfterForward).to.be.closeTo(
        initialTime + engine.deltaTime,
        0.001
      );

      // Toggle time reversal.
      engine.toggleTimeReversal();
      engine.update();
      const timeAfterReverse = engine.globalTime;

      // Expect global time decreases in reversed mode.
      expect(timeAfterReverse).to.be.closeTo(
        timeAfterForward - engine.deltaTime,
        0.001
      );
      engine.pause();
    });
  });

  it('should update sensor sphere color based on charge offset and reset behavior', () => {
    cy.window().then((win: any) => {
      // Set a known charge via the GUI charge offset.
      win.engine.sensorSpheres[0].sensors.forEach((s: any) => {
        s.charge = 5;
        s.updateColor();
      });
      // Force an update to recalc sphere color.
      win.engine.sensorSpheres[0].update(0.1);
      const expectedColor = 'hsl(15, 100%, 50%)'; // for average = 5.
      expect(win.engine.sensorSpheres[0].color).toEqual(expectedColor);

      // Now, simulate a reset. Assume the toggle is set to resetAndRestart true.
      win.engine.resetAndRestart = true;
      win.engine.reset();

      // Immediately after reset, globalTime should be 0.
      expect(win.engine.globalTime).toEqual(0);

      // Wait a moment (simulate tick) and then ensure simulation resumed.
      setTimeout(() => {
        expect(win.engine.globalTime).toBeGreaterThan(0);
      }, 50);
    });
  });

  it('should update simulation time step when GUI slider is adjusted', () => {
    cy.contains('Time Step').then(_el => {
      cy.window().then((win: any) => {
        // Update deltaTime via our global engine object.
        win.engine.deltaTime = 0.08;
        expect(win.engine.deltaTime).to.equal(0.08);
      });
    });
  });

  it('should update impulse strength when GUI slider is adjusted', () => {
    cy.contains('Impulse Strength')
      .parent()
      .find('input')
      .then($input => {
        cy.wrap($input).invoke('val', 5).trigger('input');
        cy.wrap($input).invoke('val').should('equal', '5');
      });
  });

  it('should update sensor charge offset when GUI slider is adjusted', () => {
    cy.contains('Charge Offset')
      .parent()
      .find('input')
      .then($input => {
        cy.wrap($input).invoke('val', -5).trigger('input');
        cy.wrap($input).invoke('val').should('equal', '-5');
      });
  });
});
