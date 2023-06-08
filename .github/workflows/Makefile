TARGETS := $(patsubst %.dhall,%.yml,$(wildcard *.dhall))

.SUFFIXES: .yml .dhall

.PHONY: all
all: $(TARGETS)

.dhall.yml:
	dhall-to-yaml --file $< --output $@
