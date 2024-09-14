import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  seats: any[] = []; // Array to store the seats information
  rows: number = 12; // 12 rows of seats, 11 rows with 7 seats each and the last row with 3 seats
  seatsPerRow: number = 7; // Number of seats per row (except the last row)
  lastRowSeats: number = 3; // Number of seats in the last row

  constructor() {
    this.initializeSeats(); // Initialize the seat layout when the component is created
  }

  // Initialize the seat layout
  initializeSeats() {
    // Loop through each row to create seats
    for (let row = 0; row < this.rows; row++) {
      // For each row, determine if it’s the last row or a regular row
      for (
        let seat = 1;
        seat <= (row === this.rows - 1 ? this.lastRowSeats : this.seatsPerRow);
        seat++
      ) {
        // Add each seat to the 'seats' array with a unique seat number and set as available (booked: false)
        this.seats.push({
          seatNumber: row * this.seatsPerRow + seat,
          booked: false, // All seats initially available
        });
      }
    }
  }

  // Book seats based on user input
  bookSeats(numSeats: number) {
    // Restrict the number of seats that can be booked at once to a maximum of 7
    if (numSeats > 7) {
      alert('Cannot book more than 7 seats at a time.');
      return;
    }

    // Try to find the required number of seats in the same row
    let bookedSeats = this.findSeatsInOneRow(numSeats);

    // If seats are not available in the same row, try to find nearby seats across rows
    if (!bookedSeats.length) {
      bookedSeats = this.findNearbySeats(numSeats);
    }

    // If the required number of seats are found, mark them as booked
    if (bookedSeats.length) {
      bookedSeats.forEach((seat) => {
        this.seats[seat.seatNumber - 1].booked = true; // Mark seat as booked
      });

      // Show an alert with the list of booked seat numbers
      alert(
        `Seats booked: ${bookedSeats.map((seat) => seat.seatNumber).join(', ')}`
      );
    } else {
      // If not enough seats are available, show an error alert
      alert('Not enough seats available.');
    }
  }

  // Find seats in the same row if available
  findSeatsInOneRow(numSeats: number) {
    // Loop through each row
    for (let row = 0; row < this.rows; row++) {
      const startIdx = row * this.seatsPerRow; // Calculate the start index of the row

      // Get the seats in the current row
      const rowSeats = this.seats.slice(
        startIdx,
        startIdx +
          (row === this.rows - 1 ? this.lastRowSeats : this.seatsPerRow)
      );

      // Filter out the seats that are available (not booked)
      const availableSeats = rowSeats.filter((seat) => !seat.booked);

      // If enough available seats are found in the row, return them
      if (availableSeats.length >= numSeats) {
        return availableSeats.slice(0, numSeats);
      }
    }

    // Return an empty array if no row has enough seats
    return [];
  }

  // Find nearby seats across multiple rows when not enough seats are available in a single row
  findNearbySeats(numSeats: number) {
    // Filter out all the available seats (not booked) from the seat layout
    const availableSeats = this.seats.filter((seat) => !seat.booked);

    // If enough available seats are found across multiple rows, return them
    if (availableSeats.length >= numSeats) {
      return availableSeats.slice(0, numSeats);
    }

    // Return an empty array if there are not enough nearby seats
    return [];
  }
}
