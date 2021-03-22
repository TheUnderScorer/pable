import { Component, ErrorInfo } from 'react';
import { Button, ButtonGroup, Center, Image, Text } from '@chakra-ui/react';
import React from 'react';

export interface TranslationsErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export interface TranslationsErrorBoundaryProps {
  clearEntries: () => void;
}

export class TranslationsErrorBoundary extends Component<
  TranslationsErrorBoundaryProps,
  TranslationsErrorBoundaryState
> {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
      error,
    });
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <Center display="flex" flexDirection="column">
        <Image src="https://writeandrescue.files.wordpress.com/2014/06/oops-cat1.jpg?w=620" />
        <Text fontSize="3xl">Error occurred!</Text>
        <Text mb={2}>
          Please provide following information to Przemek. You can also try
          following things:
        </Text>
        <ButtonGroup mb={6}>
          <Button onClick={this.props.clearEntries} colorScheme="dangerScheme">
            Clear all entries and reload page
          </Button>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </ButtonGroup>
        <Text color="danger">Name: {this.state.error?.name}</Text>
        <Text color="danger">Message: {this.state.error?.message}</Text>
        <Text color="danger">
          Component stack: {this.state.errorInfo?.componentStack}
        </Text>
      </Center>
    );
  }
}
