let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!

  guest = guest + 1;
  console.log(guest);
}

Cup();
Cup();
Cup();
