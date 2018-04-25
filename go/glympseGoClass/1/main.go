package main

import (
	"fmt"
	"math/rand"
	"strings"
)

func main() {
	ranks := []string{"ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"}
	suits := []string{"spades", "hearts", "clubs", "diamonds"}

	deck := generateDeck(ranks, suits)

	fmt.Println("\n******* Deck of Cards *******")
	printDeck(&deck)

	// Shuffle version
	rand.Shuffle(len(deck), func(i, j int) {
		deck[i], deck[j] = deck[j], deck[i]
	})

	// Rand.Perm version
	// for _, value := range rand.Perm(len(deck)) {
	// 	fmt.Println(strings.Title(deck[value]))
	// }

	fmt.Println("\n\n******* Randomized Deck *******")
	printDeck(&deck)

}

func generateDeck(ranks, suits []string) []string {
	deck := []string{}

	// For loop version
	// for x := 0; x < len(suits); x++ {
	// 	for y := 0; y < len(ranks); y++ {
	// 		deck = append(deck, ranks[y]+" of "+suits[x])
	// 	}
	// }

	// Range version
	for _, suit := range suits {
		for _, rank := range ranks {
			deck = append(deck, rank+" of "+suit)
		}
	}

	return deck
}

func printDeck(deck *[]string) {
	for _, card := range *deck {
		fmt.Println(strings.Title(card))
	}
}
